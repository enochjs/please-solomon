// import { IMonkManager } from 'monk'
import { MongoClient, GridFSBucket } from 'mongodb'
import { provide, container } from '../inversifyKoa/ioc'

import Config from '../config/index'
import { Stream } from 'stream'

const config = container.get<Config>('Config')

export interface ImageParam {
  name: string,
  url: string,
  size: number,
  type: string,
}

@provide('WordLibaryDb')
export default class WordLibaryDb {

  // @inject('Mongodb')
  // private mongodb: IMonkManager

  /**
   * 存储录音
   * @param {{ data: Stream, word: string, dst: string}} { data, word, dst }
   * @memberof WordLibaryDb
   */
  public async addWord ({ data, word, dst }: { data: Stream, word: string, dst: string}) {

    MongoClient.connect(config.getMongoDB(), (err, client) => {
      const db = client.db('please')
      const bucket = new GridFSBucket(db, { bucketName: 'wordLibary' })
      const uploadStream = bucket.openUploadStream(word)
      const wordId = uploadStream.id
      data.pipe(uploadStream)
      return wordId
    })
  }

  /**
   * 获取录音
   * @param {string} word
   * @returns {Promise <any>}
   * @memberof WordLibaryDb
   */
  public async getWord (word: string): Promise <any> {
    // const wordLibary = await this.mongodb.get('wordLibary')
    // const result = await wordLibary.findOne({ word })

    return new Promise((resolve, reject) => {
      MongoClient.connect(config.getMongoDB(), (err, client) => {

        const db = client.db('please')
        const bucket = new GridFSBucket(db, { bucketName: 'wordLibary' })
        const downloadStream = bucket.openDownloadStreamByName(word)
        resolve(downloadStream)
      })
    })
  }

}
