import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Button } from 'antd'
import { chunk } from 'lodash'
import { FormComponentProps } from 'antd/lib/form/Form'
import './index.less'

const Option = Select.Option
const FormItem = Form.Item

interface ISearhFormProps extends FormComponentProps {
  searchList: ISearchListValue[]
  formValue: any,
  formColsNum?: number,
  onSubmit?: Function,
  clear: Function,
  cacheSearch: Function,
}

export interface ISearchListValue {
  key: string,
  type: string,
  label: string,
  onChange?: Function,
  options?: any[],
  value?: string,
  text?: string,
  allowClear?: boolean,
}

export class SearchForm extends Component<ISearhFormProps, any> {
  getSearchItem (item: ISearchListValue) {
    switch (item.type) {
    case 'select': return this.getSelect(item)
    case 'text': return this.getText(item)
    default: this.getText(item); break
    }
    return []
  }

  getText (item: ISearchListValue) {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator(item.key)(<Input />)
  }

  getSelect (item: ISearchListValue) {
    const { getFieldDecorator } = this.props.form
    return getFieldDecorator(item.key)(
      <Select
        onChange={(value) => { item.onChange && item.onChange(value) }}
        allowClear={item.allowClear}
        showSearch={true}
        filterOption={(input, option: any) => {
          const str = option.props.children
          return str.indexOf(input) >= 0
        }}
      >
        {item.options && item.options.map((option, index) =>
          <Option key={index.toString()}
            value={item.value && option[item.value].toString()}
          >{item.text && option[item.text]}</Option>)}
      </Select>)
  }

  renderRow (arr: ISearchListValue[], index: number) {
    const { formColsNum } = this.props
    const cols = formColsNum || 4
    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 14 },
    }
    return (
      <div key={index.toString()} className="clearfix"
        style={{ zIndex: 100 - index, position: 'relative' }}
      >
        {
          arr.map((item, key) => (
            <Col md={24 / cols} key={key}>
              <FormItem {...formItemLayout} label={item.label}>
                {this.getSearchItem(item)}
              </FormItem>
            </Col>
          ))
        }
      </div>
    )
  }

  onSubmit = () => {
    typeof this.props.onSubmit === 'function' && this.props.onSubmit()
  }

  clear = () => {
    this.props.clear()
  }

  render () {
    const { searchList, formColsNum } = this.props
    const cols = formColsNum || 4
    return (
      <Form className="mb20 search-form">
        <Row gutter={16}>
          {
            chunk(searchList, cols).map((row, index) => this.renderRow(row, index))
          }
        </Row>
        <Row>
          <Col span={12} offset={12} style={{ textAlign: 'right' }}>
            <Button className="mr10" type="primary" onClick={this.onSubmit}>搜索</Button>
            <Button onClick={this.clear}>重置</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create<ISearhFormProps>({
  onFieldsChange (props, item) {
    const key = Object.keys(item)[0]
    props.cacheSearch({ [key]: item[key].value })
  },
  mapPropsToFields (props) {
    const fields = {}
    props.searchList.map((item: any) => {
      if (typeof (item.key) !== 'string') {
        for (const i of item.key) {
          fields[item.key[i]] = Form.createFormField({ value: props.formValue[item.key[i]] })
        }
        // for (let i = 0; i < item.key.length; i++) {
        //   fields[item.key[i]] = Form.createFormField({ value: props.formValue[item.key[i]] })
        // }
      } else {
        fields[item.key] = Form.createFormField({ value: props.formValue[item.key] })
      }
    })
    return fields
  },
})(SearchForm)
