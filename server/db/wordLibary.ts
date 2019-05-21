import { IMonkManager } from 'monk'
import { MongoClient, GridFSBucket } from 'mongodb'
import { provide, container, inject } from '../inversifyKoa/ioc'
import { Stream } from 'stream'

import Config from '../config/index'

const config = container.get<Config>('Config')

@provide('WordLibaryDb')
export default class WordLibaryDb {

  @inject('Mongodb')
  private mongodb: IMonkManager

  /**
   * 存储录音
   * @param {{ voice: Stream, word: string }} { voice, word }
   * @returns
   * @memberof WordLibaryDb
   */
  public async addVoice ({ voice, word }: { voice: Stream, word: string }) {
    const voiceId = await new Promise((resolve, reject) => {
      MongoClient.connect(config.getMongoDB(), (err, client) => {
        const db = client.db('please')
        const bucket = new GridFSBucket(db, { bucketName: 'voiceLibary' })
        const uploadStream = bucket.openUploadStream(word)
        voice.pipe(uploadStream)
        resolve(uploadStream.id)
      })
    })
    return voiceId
  }

  /**
   * 存储单词信息
   * @param {{ voice: Stream, word: string, explanation: string}} { voice, word, explanation }
   * @returns
   * @memberof WordLibaryDb
   */
  public async addWord ({ voice, word, explanation }: { voice: Stream, word: string, explanation: string}) {

    const wordCollection = await this.mongodb.get('wordLibary')
    const wordExit = await wordCollection.findOne({ word })
    if (wordExit) {
      return true
    }
    const voiceId = await this.addVoice({ voice, word })
    const result = await wordCollection.insert({
      word,
      explanation,
      voiceId,
    })
    return result

  }

  /**
   * 获取录音
   * @param {string} word
   * @returns {Promise <any>}
   * @memberof voiceLibaryDb
   */
  public async getVoice (word: string): Promise <any> {
    return new Promise((resolve, reject) => {
      MongoClient.connect(config.getMongoDB(), (err, client) => {
        const db = client.db('please')
        const bucket = new GridFSBucket(db, { bucketName: 'voiceLibary' })
        const downloadStream = bucket.openDownloadStreamByName(word)
        resolve(downloadStream)
      })
    })
  }

  /**
   * 查询单词
   * @param {string} word
   * @returns {Promise <any>}
   * @memberof WordLibaryDb
   */
  public async getWord (word: string): Promise <any> {
    const wordCollection = await this.mongodb.get('wordLibary')
    const result = await wordCollection.findOne({ word })
    if (result) {
      return {
        explanation: result.explanation,
        voiceUrl: `/api/translate/voice?query=${word}`,
      }
    }
    return null
  }

}
