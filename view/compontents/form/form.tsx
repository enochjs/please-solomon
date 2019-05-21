import React, { Component } from 'react'
import { Form, Row, Col } from 'antd'
import moment from 'moment'
import { FormComponentProps } from 'antd/lib/form/Form'
import { InputItem, SelectItem } from './index'
import './index.less'

export interface IFormProps extends FormComponentProps {
  formColumns: IFormColumnValue[]
  formValue: any,
  cacheFormValue: Function,
  className?: string,
}

export interface IFormColumnValue {
  id: string | string[],
  cityId?: number,
  type: string,
  onSearch?: Function,
  formItemLabel: string,
  onChange?: Function,
  options?: any[],
  optionValueKey?: string,
  optionLabelKey?: string,
  allowClear?: boolean,
  validate?: Function,
  rules?: any[],
  span?: number,
  formItemLayout?: any
}

export class PleaseForm extends Component<IFormProps, any> {

  formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 14 },
  }

  getFormItem (item: IFormColumnValue) {
    switch (item.type) {
      case 'select': return this.getSelect(item)
      case 'text': return this.getText(item)
      default: this.getText(item); break
    }
  }

  getText (item) {
    return <InputItem
      id={item.id}
      form={this.props.form}
      formItemLayout={this.formItemLayout}
      formItemLabel={item.formItemLabel}
      rules={item.rules}
    />
  }

  getSelect (item: IFormColumnValue) {
    return  <SelectItem
      id={item.id}
      form={this.props.form}
      formItemLayout={this.formItemLayout}
      formItemLabel={item.formItemLabel}
      rules={item.rules}
      options={item.options || []}
      onChange={item.onChange}
      onSearch={item.onSearch}
      allowClear={item.allowClear}
      optionValueKey={item.optionValueKey}
      optionLabelKey={item.optionLabelKey}
    />
  }

  renderRow (arr: IFormColumnValue[]) {
    return (
      <div className="clearfix"
        style={{ zIndex: 100, position: 'relative' }}
      >
        {
          arr.map((item, key) => (
            <Col md={item.span || 24} key={key}>
              {this.getFormItem(item)}
            </Col>
          ))
        }
      </div>
    )
  }

  render () {
    const { formColumns, className } = this.props
    return (
      <Form className={`mb20 please-form ${className || ''}`}>
        <Row gutter={16}>
          {
            this.renderRow(formColumns)
          }
        </Row>
      </Form>
    )
  }
}

export default Form.create<IFormProps>({
  onFieldsChange (props, field) {
    const key = Object.keys(field)[0]
    const fields = props.formValue.fields || {}
    const keysValue = {}
    if (key.split(',').length > 1) {
      const keys = key.split(',')
      for (let i = 0; i < keys.length; i++) {
        if (moment.isMoment(field[key].value[i])) {
          keysValue[keys[i]] = field[key].value[i]._i
        } else {
          keysValue[keys[i]] = field[key].value[i]
        }
      }
      props.cacheFormValue({ ...keysValue, fields: { ...fields, ...field }  })
    } else {
      props.cacheFormValue({ [key]: field[key].value || '', fields: { ...fields, ...field }  })
    }
  },
  mapPropsToFields (props) {
    const fields = props.formValue.fields || {}
    props.formColumns.map((item: any) => {
      if (Array.isArray(item.id)) {
        for (const key of item.id) {
          fields[key] = fields[key] ? Form.createFormField({ ...fields[key], value: props.formValue[key] }) : Form.createFormField({ value: props.formValue[key] })
        }
        if (item.type === 'rangePicker') {
          const fieldValue = props.formValue[item.id[0]] && props.formValue[item.id[0]] ? [moment(props.formValue[item.id[0]]), moment(props.formValue[item.id[1]])] : []
          fields[item.id.toString()] = fields[item.id] ? Form.createFormField({ ...fields[item.id.toString()], value: fieldValue }) : Form.createFormField({ value: fieldValue })
        }
      } else {
        fields[item.id] = fields[item.id] ? Form.createFormField({ ...fields[item.id], value: props.formValue[item.id] }) : Form.createFormField({ value: props.formValue[item.id] })
      }
    })
    return fields
  },
})(PleaseForm)
