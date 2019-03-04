// import * as md5 from 'md5'
import axios from 'axios'
import { provide } from '../inversifyKoa/ioc'

@provide('BaiduTranslateService')
export default class BaiduTranslateService {

  // private appid = '20190304000273529'

  // private key = '8BUKsnkzxvEsRPOuD7kF'

  private voiceAppid = 'EIPjGBhgFHPucETvMGxxcMiV'

  private voiceKey = 'j0k7Q9SpfWsKqvxNhK9gxFMSauoHjtKh'

  private async getToken () {
    const result = await axios.get(`https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=${this.voiceAppid}&client_secret=${this.voiceKey}`)
    return result.data
  }

  public async getTranslate (query: string) {

    const token = await this.getToken()
    const translate: any = await axios.get(`https://fanyi.baidu.com/transapi?from=auto&to=cht&query=${query}`)

    // const salt = new Date().getTime()
    // const curtime = Math.round(new Date().getTime() / 1000)
    // const from = 'auto'
    // const to = 'auto'
    // const translate: any = await axios.get(`http://api.fanyi.baidu.com/api/trans/vip/translate`, {
    //   params: {
    //     q: query,
    //     appid: this.appid,
    //     salt,
    //     from,
    //     to,
    //     curtime,
    //     sign: md5(this.appid + query + salt + this.key),
    //   },
    // })

    return {
      translate: translate.data.data,
      voiceUrl: `http://tsn.baidu.com/text2audio?tex=${query}&lan=zh&cuid=12111111&ctp=1&tok=${token.access_token}`,
    }
  }

}
