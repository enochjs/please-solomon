import * as React from 'react'
import { connect } from 'redux-zero-x'
import { Button, Modal } from 'antd'
import moment from 'moment'

import SearchForm from '../../../compontents/searchForm'
import Table from '../../../compontents/table'
import AddEditModal, { AddEdit } from './addEdit'
import { getImgUrl } from '../../../utils'

import { PendingListStore } from './store'
import { Pagination } from '../../../types/index'

const ButtonGroup = Button.Group
const confirm = Modal.confirm

export interface IProps extends PendingListStore {
  data: Pagination
  formValue: any
}

@connect('PendingListStore')
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
    const { getPendingList } = this.props
    getPendingList({ name: '' })
  }

  private getSearchList = () => [{
    type: 'text',
    key: 'name',
    label: 'name',
  }, {
    type: 'text',
    key: 'mobile',
    label: 'mobile',
  }, {
    type: 'text',
    key: 'idCard',
    label: 'idCard',
  }]

  private cacheSearch = (item) => {
    this.props.updateFormValue(item)
  }

  private clear = () => {
    this.props.resetFormValue()
  }

  public query = () => {
    const { getPendingList, formValue } = this.props
    getPendingList(formValue)
  }

  handleDelete = (record: any) => {
    const { deletePendingUser } = this.props
    confirm({
      title: '删除?',
      content: '确定删除？',
      onOk: () => {
        deletePendingUser({ _id: record._id }).then(() => {
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
          searchList={this.getSearchList()}
          formValue={this.props.formValue}
          cacheSearch={this.cacheSearch}
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
