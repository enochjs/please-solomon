import { IMonkManager } from 'monk'
import * as md5 from 'md5'
import { provide, inject } from '../inversifyKoa/ioc'
import { filterDecorator } from '../utils/decorators'

export interface ImageParam {
  name: string,
  url: string,
}

@provide('AuthDb')
export default class AuthDb {

  @inject('Mongodb')
  private mongodb: IMonkManager

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
    const authCollection = await this.mongodb.get('auth')
    const user: any = await authCollection.find({ username })
    if (!user.length) {
      throw new Error('用户名不存在！')
    }
    if (md5(password) === user[0].password) {
      return true
    } else {
      throw new Error('用户名密码错误！')
    }
  }

}
