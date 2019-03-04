import { sha256 } from 'js-sha256'
import axios from 'axios'
import { provide } from '../inversifyKoa/ioc'

/** 收费，嫌弃 */

export interface ImageParam {
  name: string,
  url: string,
}

@provide('YoudaoTranslateService')
export default class YoudaoTranslateService {

  private appKey = '6954ac48477d8c65'

  private key = 'GSQED0u5YFWpJtn0ZLEUIfYV0mo9az1Z'

  private getSign = (query: string, salt: number, curtime: number) => {
    if (query.length === 0) {
      return null
    }
    let result
    const len = query.length
    if (len <= 20) {
      result = query
    } else {
      const startStr = query.substring(0, 10)
      const endStr = query.substring(len - 10, len)
      result = startStr + len + endStr
    }
    const sign = sha256(this.appKey + result + salt + curtime + this.key)
    return sign
  }

  public async getTranslate (query: string) {
    const salt = new Date().getTime()
    const curtime = Math.round(new Date().getTime() / 1000)
    const from = 'auto'
    const to = 'zh-CHS'
    const sign = this.getSign(query, salt, curtime)
    const translate = await axios.get(`http://openapi.youdao.com/api`, {
      params: {
        q: query,
        appKey: this.appKey,
        salt,
        from,
        to,
        curtime,
        sign,
        signType: 'v3',
      },
    })
    return translate.data
  }

}
