import axios from 'axios'
import * as fs from 'fs'
import * as path from 'path'
import { provide, inject } from '../inversifyKoa/ioc'
import WordLibaryDb from '../db/wordLibary'

@provide('BaiduTranslateService')
export default class BaiduTranslateService {

  @inject('WordLibaryDb')
  private wordLibaryDb: WordLibaryDb

  private voiceAppid = 'EIPjGBhgFHPucETvMGxxcMiV'

  private voiceKey = 'j0k7Q9SpfWsKqvxNhK9gxFMSauoHjtKh'

  private expiresTime = 0

  private token: any = {}

  private async getToken () {

    if (new Date().getTime() > this.expiresTime) {
      const result = await axios.get(`https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.voiceAppid}&client_secret=${this.voiceKey}`)
      this.token = result.data
      this.expiresTime = new Date().getTime() + result.data.expires_in * 1000
    }
    return this.token
  }

  private async downloadSong (url: string, filename: string, dir: string, dst: string) {
    axios({
      method: 'get',
      url,
      responseType: 'stream',
    }).then((result) => {
      result.data.pipe(fs.createWriteStream(path.join(__dirname, `/../../${dir}`, filename + '.mp3')))
      .on('error', function (err: any) {
          console.log(filename, ' download error!', err)
      })
      .on('close', () => {
          const stream = fs.createReadStream(path.join(__dirname, `/../../${dir}`, filename + '.mp3'))
          /** 不能直接用response data 会有bug，数据会损坏 */
          this.wordLibaryDb.addWord({ voice: stream, word: filename, explanation: dst })
          fs.readFile(path.join(__dirname, `/../../${dir}`, 'contents.json'), (error, data) => {
            let contents = {}
            if (data) {
              try {
                contents = JSON.parse(data.toString())
              } catch (error) {
                console.log('...parse content err', error)
              }
            }
            if (typeof contents !== 'object') {
              contents = {}
            }
            contents[filename] = true
            fs.writeFile(path.join(__dirname, `/../../${dir}`, 'contents.json'), JSON.stringify(contents), (err) => {
              console.log(filename, ' write error!', err)
            })
          })
      })
    })
  }

  public async getTranslate (query: string) {
    const token = await this.getToken()
    const translate: any = await axios.get(`https://fanyi.baidu.com/transapi?from=auto&to=cht&query=${query}`)
    const voiceUrl = `http://tsn.baidu.com/text2audio?tex=${query}&lan=zh&cuid=12111111&ctp=1&tok=${token.access_token}`
    const explanation = translate.data.data ? translate.data.data.map((item: any) => item.dst).join(';') : ''
    this.downloadSong(voiceUrl, query, 'mp3', explanation)
    return {
      explanation,
      voiceUrl,
    }
  }

}
