import { Store, action } from 'redux-zero-x'
import { Moment } from 'moment'
import { fetchJSONByGet, fetchJSONByPost, fetchJSONByPut, fetchJSONByDelete } from '../../../utils/fetchApi'

export interface IFormValue {
  name?: string
  mobile?: string
  birthday?: Moment
  idCard?: string
  sex?: number
}

export interface IPendingListStore {
  updateFormValue?: Function
  resetFormValue?: Function
  getPendingList?: Function
  addPendingUser?: Function
  updatePendingUser?: Function
  deletePendingUser?: Function
}

export class PendingListStore extends Store implements IPendingListStore {

  private initFormValue = () => ({
    name: '',
    mobile: '',
    birthday: '',
    idCard: '',
    sex: '',
  })

  public state = {
    formValue: this.initFormValue(),
    data: {
      list: [],
      currentPage: 1,
      pageSize: 1,
      count: 0,
    },
  }

  @action
  public updateFormValue (item: object) {
    return { formValue: { ...this.getState().formValue, ...item } }
  }
  @action
  public resetFormValue () {
    return { formValue: this.initFormValue() }
  }

  @action()
  public async getPendingList (param) {
    const data = await fetchJSONByGet('/api/user/pending/list', param)
    return { data }
  }

  @action()
  public async addPendingUser (param) {
    return await fetchJSONByPost('/api/user/pending/add', param)
  }

  @action()
  public async updatePendingUser (param) {
    return await fetchJSONByPut('/api/user/pending/update', param)
  }

  @action()
  public async deletePendingUser (param) {
    return await fetchJSONByDelete('/api/user/pending/delete/:_id', param)
  }
}

export default new PendingListStore()
