import React, { Component } from 'react'
import { Table } from 'antd'
import { TableProps } from 'antd/lib/table/interface'

interface IProps extends TableProps<any> {
  dataSource: any[],
  columns: any[],
  rowKey: string | ((record: any, index: number) => string)
}

export default class PleaseTable extends Component<IProps, any> {

  shouldComponentUpdate (nextProps: IProps, nextState: any) {
    if (nextProps.dataSource === this.props.dataSource && nextProps.columns !== this.props.columns) {
      return false
    }
    return true
  }

  render () {
    const { columns, dataSource, rowKey } = this.props
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        {...this.props}
      />
    )
  }
}
