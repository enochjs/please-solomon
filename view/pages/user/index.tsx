import * as React from 'react'
import { connect } from 'redux-zero-x'
import { Button, Modal } from 'antd'
import moment from 'moment'

import SearchForm from '../../compontents/form/searchForm'
import Table from '../../compontents/table'
import AddEditModal, { AddEdit } from './addEdit'
import { getImgUrl } from '../../utils'

import { UserListStore } from './store'
import { Pagination } from '../../types/index'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

export interface IProps extends UserListStore {
  data: Pagination
  formValue: any
}

@connect(['userListStore'])
export default class PendingList extends React.Component<IProps, any> {

  constructor (props: IProps) {
    super(props)
    this.state = {
      formValue: {
        _id: '',
        name: '',
        mobile: '',
        birthday: '',
        idCard: '',
        sex: '',
        height: '',
        weight: '',
        introduce: '',
        images: [],
      },
    }
  }

  addEdit: AddEdit

  componentWillMount () {
    const { getUserList } = this.props
    getUserList({ name: '' })
  }

  private getFormColumns = () => [{
    type: 'text',
    id: 'name',
    formItemLabel: 'name',
    span: 6,
  }, {
    type: 'text',
    id: 'mobile',
    formItemLabel: 'mobile',
    span: 6,
  }, {
    type: 'text',
    id: 'idCard',
    formItemLabel: 'idCard',
    span: 6,
  }]

  private cacheFormValue = (item) => {
    this.props.updateFormValue(item)
  }

  private clear = () => {
    this.props.resetFormValue()
  }

  public query = () => {
    const { getUserList, formValue } = this.props
    getUserList(formValue)
  }

  handleDelete = (record: any) => {
    const { deleteUser } = this.props
    confirm({
      title: '删除?',
      content: '确定删除？',
      onOk: () => {
        deleteUser({ _id: record._id }).then(() => {
          this.query()
        })
      },
    })
  }

  private getColumns = () => {
    const columns: any = [
      { title: 'index', key: 'index', render: (text: string, record: any, index: number) => <span>{index + 1}</span>},
      { title: '姓名', dataIndex: 'name', key: 'name' },
      { title: '电话', dataIndex: 'mobile', key: 'mobile' },
      { title: '出生年月', dataIndex: 'birthday', key: 'birthday' },
      { title: '身份证', dataIndex: 'idCard', key: 'idCard' },
      { title: '性别', dataIndex: 'sex', key: 'sex' },
      { title: '身高', dataIndex: 'height', key: 'height' },
      { title: '体重', dataIndex: 'weight', key: 'weight' },
      {
        title: '图片',
        key: 'images',
        render: (text: string, record: any, index: number) =>
          <span>{record.images && record.images.map((image) => <img key={image} className="mr10" width="20" height="20" src={getImgUrl(image)} />)}</span>,
      },
      { title: '介绍', dataIndex: 'introduce', key: 'introduce' },
      {
        title: '操作',
        key: 'operate',
        render: (text: string, record: any, index: number) =>
          <ButtonGroup>
            <Button type="primary" size="small" onClick={() => this.handleEdit(record)}>编辑</Button>
            <Button type="primary" size="small" onClick={() => this.handleDelete(record)}>删除</Button>
          </ButtonGroup>,
      },
    ]
    return columns
  }

  cacheInstance = (name: string, instance: AddEdit) => {
    this[name] = instance
  }

  handleAdd = () => {
    this.setState({
      formValue: {
        name: '',
        mobile: '',
        birthday: moment(),
        idCard: '',
        sex: '',
        height: '',
        weight: '',
        introduce: '',
        images: [],
      },
    }, () => {
      this.addEdit.show()
    })
  }

  handleEdit = (record: any) => {
    this.setState({
      formValue: {
        _id: record._id,
        name: record.name,
        mobile: record.mobile,
        birthday: moment(record.birthday),
        idCard: record.idCard,
        sex: record.sex,
        height: record.height,
        weight: record.weight,
        introduce: record.introduce,
        images: record.images,
      },
    }, () => {
      this.addEdit.show()
    })
  }

  render () {
    const { data } = this.props
    return (
      <div>
        <SearchForm
          formColumns={this.getFormColumns()}
          formValue={this.props.formValue}
          cacheFormValue={this.cacheFormValue}
          clear={this.clear}
          onSubmit={this.query}
        />
        <div className="mt20 mb20">
          <Button type="primary" size="small" onClick={this.handleAdd}>新增</Button>
        </div>
        <Table
          columns={this.getColumns()}
          dataSource={data.list}
          scroll={{x: 1000}}
          bordered={true}
          pagination={false}
          rowKey={'_id'}
        />
        <AddEditModal
          formValue={this.state.formValue}
          cacheInstance={(instance) => this.cacheInstance('addEdit', instance)}
          query={this.query}
        />
      </div>
    )
  }
}
