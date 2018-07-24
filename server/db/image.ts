import { IMonkManager, id } from 'monk'
import { provide, inject } from '../inversifyKoa/ioc'

export interface ImageParam {
  name: string,
  url: string,
  size: number,
  type: string,
}

@provide('ImageDb')
export default class ImageDb {

  @inject('Mongodb')
  private mongodb: IMonkManager

  /**
   * save image msg
   * @param {ImageParam} param
   * @returns
   * @memberof ImageDb
   */
  public async uploadImg (param: ImageParam) {
    const imgCollection = this.mongodb.get('image')
    const result = await imgCollection.insert({
      name: param.name,
      url: param.url,
      size: param.size,
      type: param.type,
    })
    return result._id
  }

  /**
   * 根据id 获取图片信息
   * @param {string} objectId
   * @memberof ImageDb
   */
  public async getImgById (objectId: string) {
    const imgCollection = this.mongodb.get('image')
    const result = await imgCollection.findOne({ _id: id(objectId) })
    return result
  }

  /**
   * get pending user list
   * @param {userParam} param
   * @returns
   * @memberof ImageDb
   */
  public async getUserList () {
    const userCollection = this.mongodb.get('user')
    const result = await userCollection.find({})
    return result
  }
}
