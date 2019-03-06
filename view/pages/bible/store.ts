import { Store, action } from 'redux-zero-x'
import { fetchJSONByGet } from '../../utils/fetchApi'

export interface IBibleStore {
  getTranslate?: Function
}

export class BibleStore extends Store  {

  public state = {
    data: {
      translate: [{ dst: '' }],
      voiceUrl: '',
    },
  }

  @action()
  public async getTranslate (param, cb) {
    const data = await fetchJSONByGet('/api/translate/baidu', param)
    cb && cb(data)
    return { data }
  }

}

export default new BibleStore()
