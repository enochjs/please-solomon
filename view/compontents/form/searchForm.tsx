import React, { Component } from 'react'
import { Button } from 'antd'
import Form, { IFormColumnValue } from './form'
import './index.less'

interface ISearhFormProps {
  onSubmit: Function,
  clear: Function,
  formColumns: IFormColumnValue[]
  formValue: any,
  cacheFormValue: Function,
  className?: string,
}

export default class SearchForm extends Component<ISearhFormProps, any> {

  form: any

  onSubmit = () => {
    this.form.validateFields({force: true}, (err) => {
      if (err) {
        return
      } else {
        typeof this.props.onSubmit === 'function' && this.props.onSubmit()
      }
    })
  }

  clear = () => {
    this.props.clear()
  }

  render () {
    const { formColumns, formValue, cacheFormValue } = this.props
    return (
      <div className="search-form">
        <Form
          ref={(r) => this.form = r}
          formColumns={formColumns}
          formValue={formValue}
          cacheFormValue={cacheFormValue}
        />
        <div style={{ textAlign: 'right' }}>
          <Button className="mr10" type="primary" onClick={this.onSubmit}>搜索</Button>
          <Button onClick={this.clear}>重置</Button>
        </div>
      </div>
    )
  }
}
