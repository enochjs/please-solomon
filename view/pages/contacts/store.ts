import { Store, action } from 'redux-zero-x'
import { fetchJSONByGet } from '../../utils/fetchApi'

export class ContatcsStore extends Store {

state = {
    count: 1,
    data: '',
  }

  @action
  increment () {
    return { count: this.getState().count + 1 }
  }
  @action
  decrement () {
    return { count: this.getState().count - 1 }
  }

  @action()
  async getHelloWorld (param) {
    const data = await fetchJSONByGet('/api/hello/world', param)
    return { data}
  }

}
export default new ContatcsStore({ count: 0, data: '' })
