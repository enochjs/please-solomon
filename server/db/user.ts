import { IMonkManager, id } from 'monk'
import * as md5 from 'md5'
import { Logger } from 'winston'
import { pick, repeat } from 'lodash'
import { provide, inject } from '../inversifyKoa/ioc'
import { filterDecorator } from '../utils/decorators'

export interface IUserParam {
  _id?: string,
  name: string,
  mobile: number,
  birthday: string,
  idCard: string,
  sex: number,
  height: number,
  weight: number,
  images: string[],
  introduce: string,
  operator: string,
}

export interface IQueryParam {
  name?: string,
  mobile?: number,
  idCard?: string,
  sex?: number,
}

@provide('UserDb')
export default class UserDb {

  @inject('logger')
  private logger: Logger

  @inject('Mongodb')
  private mongodb: IMonkManager

  private formatCode (value: number) {
    const length = value.toString().length
    return repeat('0', 5 - length) + value
  }

  /**
   * 用户登录用户名密码匹配
   * @param {string} username
   * @param {string} password
   * @returns
   * @memberof AuthDb
   */
  @filterDecorator({
    username: { type: 'string', required: true },
    password: { type: 'string', required: true },
  })
  public async checkUser (username: string, password: string) {
    const userCollection = await this.mongodb.get('user')
    const user: any = await userCollection.find({ code: username })
    if (!user.length) {
      throw new Error('用户名不存在！')
    }
    if (md5(password) === user[0].password) {
      return true
    } else {
      throw new Error('用户名密码错误！')
    }
  }

  /**
   * add usesr
   * @param {IUserParam} param
   * @returns
   * @memberof UserDb
   */
  @filterDecorator({
    name: { type: 'string', required: true },
    mobile: { type: 'number', required: true },
    birthday: { type: 'string', required: true },
    idCard: { type: 'string', required: true },
    sex: { type: 'number', required: true },
    height: { type: 'number', required: true },
    weight: { type: 'number', required: true },
    images: { type: 'string[]', required: true },
    introduce: { type: 'string', required: true },
    operator: { type: 'string', required: false },
  })
  public async addUser (param: IUserParam) {
    const userCollection = this.mongodb.get('user')
    const mobile = await userCollection.find({ mobile: param.mobile })
    const idCard = await userCollection.find({ idCard: param.idCard })
    if (mobile.length) {
      throw new Error('该号码已被注册！')
    }
    if (idCard.length) {
      throw new Error('该身份证已被注册过！')
    }
    const allusers = await userCollection.find({})
    const result = await userCollection.insert({
      name: param.name,
      code: this.formatCode(allusers.length + 1),
      password: md5('jesusLovesUs'),
      mobile: param.mobile,
      birthday: param.birthday,
      idCard: param.idCard,
      sex: param.sex,
      height: param.height,
      weight: param.weight,
      images: param.images,
      introduce: param.introduce,
      createTime: new Date().getTime(),
    })
    return result
  }

  /**
   * 用户编辑
   * @param {IUserParam} param
   * @memberof UserDb
   */
  @filterDecorator({
    _id: { type: 'string', required: true },
    name: { type: 'string', required: true },
    mobile: { type: 'number', required: true },
    birthday: { type: 'string', required: true },
    idCard: { type: 'string', required: true },
    sex: { type: 'number', required: true },
    height: { type: 'number', required: true },
    weight: { type: 'number', required: true },
    images: { type: 'string[]', required: true },
    introduce: { type: 'string', required: true },
    operator: { type: 'string', required: false },
  })
  public async updateUser (param: IUserParam) {
    const userCollection = this.mongodb.get('user')
    const mobile: any = await userCollection.find({ mobile: param.mobile })
    const idCard: any = await userCollection.find({ idCard: param.idCard })
    if (mobile.length && mobile[0]._id.toString() !== param._id) {
      throw new Error('该号码已被注册！')
    }
    if (idCard.length  && idCard[0]._id.toString() !== param._id) {
      throw new Error('该身份证已被注册过！')
    }
    const result = await userCollection.update({_id: id(param._id)}, {
      name: param.name,
      mobile: param.mobile,
      birthday: param.birthday,
      idCard: param.idCard,
      sex: param.sex,
      height: param.height,
      weight: param.weight,
      images: param.images,
      introduce: param.introduce,
      updateTime: new Date().getTime,
    })
    return result
  }

  /**
   * del pending user list
   * @param {IUserParam} param
   * @returns
   * @memberof UserDb
   */
  @filterDecorator({
    _id: { type: 'string', required: true },
  })
  public async delUserList (_id: string) {
    const userCollection = this.mongodb.get('user')
    const result = await userCollection.remove({_id: id(_id)})
    return result
  }

  /**
   * get pending user list
   * @param {IUserParam} param
   * @returns
   * @memberof UserDb
   */
  @filterDecorator({
    name: { type: 'string', required: false },
    mobile: { type: 'number', required: false },
    idCard: { type: 'string', required: false },
    sex: { type: 'number', required: false },
  })
  public async getUserList (param: IQueryParam) {
    const queryParam = pick(param, ['name', 'mobile', 'idCard', 'sex'])
    const userCollection = this.mongodb.get('user')
    this.logger.info('mongo query param', Object.keys(queryParam).map((key) => ({ [key]: queryParam[key] })))
    let result = []
    if (Object.keys(queryParam).length) {
      result = await userCollection.find({ $and: Object.keys(queryParam).map((key) => ({ [key]: queryParam[key] })) })
    } else {
      result = await userCollection.find({})
    }
    return result
  }
}
