import { Store, action } from 'redux-zero-x'
import { Moment } from 'moment'
import { fetchJSONByGet, fetchJSONByPost, fetchJSONByPut, fetchJSONByDelete } from '../../utils/fetchApi'

export interface IFormValue {
  name?: string
  mobile?: string
  birthday?: Moment
  idCard?: string
  sex?: number
}

export interface IUserListStore {
  updateFormValue?: Function
  resetFormValue?: Function
  getUserList?: Function
  addUser?: Function
  updateUser?: Function
  deleteUser?: Function
}

export class UserListStore extends Store<any> implements IUserListStore {

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
  public async getUserList (param) {
    const data = await fetchJSONByGet('/api/user/list', param)
    return { data }
  }

  @action()
  public async addUser (param) {
    return await fetchJSONByPost('/api/user/add', param)
  }

  @action()
  public async updateUser (param) {
    return await fetchJSONByPut('/api/user/update', param)
  }

  @action()
  public async deleteUser (param) {
    return await fetchJSONByDelete('/api/user/delete/:_id', param)
  }
}

export default new UserListStore()
