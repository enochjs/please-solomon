import React from 'react'
import { Form, Input, Select, Radio } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

const Option = Select.Option
const TextArea = Input.TextArea
const RadioGroup = Radio.Group

export interface IFormItemProps extends FormComponentProps {
  formItemLayout?: any,
  rules?: any[],
  id: string | string[],
  formItemLabel?: string,
  onChange?: Function
  placeholder?: string
}

export interface ISelectItemProps extends IFormItemProps {
  options: any[]
  allowClear?: boolean
  onSearch?: Function
  optionValueKey?: string
  optionLabelKey?: string
  useCustomKey?: boolean
  classname?: string
}

export interface IRangePickerProps extends IFormItemProps {
  id: string[]
  format: string,
  placeholder?: any
}

export interface IUserSearchSelectProps extends IFormItemProps {
  id: string
  cityId: number
  type: number
  disabled?: boolean
}

export interface IItemCodeProps extends IFormItemProps {
  id: string
  source: number,
}

export interface ITextAreaItemProps extends IFormItemProps {
  id: string
  rows?: number,
  autosize?: any
}

export interface IRadioGroupItemProps extends IFormItemProps {
  options: any[]
  allowClear?: boolean
  optionValueKey?: string
  optionLabelKey?: string
  useCustomKey?: boolean
  classname?: string
}

export const FormItem = Form.Item

export const InputItem = ({form, rules, id, formItemLayout, formItemLabel, placeholder, onChange }: IFormItemProps) =>
  <FormItem {...formItemLayout} label={formItemLabel}>
  {
    form.getFieldDecorator(id.toString(), {
      rules: rules ? rules : [],
    })(<Input placeholder={placeholder} onChange={(e) => {
      onChange && onChange(e.target && e.target.value)}
    } />)
  }
  </FormItem>

export const TextAreaItem = ({form, rules, id, formItemLayout, formItemLabel, placeholder, rows, autosize }: ITextAreaItemProps) =>
  <FormItem {...formItemLayout} label={formItemLabel}>
  {
    form.getFieldDecorator(id.toString(), {
      rules: rules ? rules : [],
    })(<TextArea placeholder={placeholder} rows={rows} autosize={autosize} />)
  }
  </FormItem>

export const SelectItem = ({
  form, rules, id, formItemLabel, formItemLayout, options, onChange, onSearch, allowClear, optionValueKey, optionLabelKey, placeholder,
}: ISelectItemProps) =>
  <FormItem {...formItemLayout} label={formItemLabel}>
  {
    form.getFieldDecorator(id.toString(), {
      rules: rules ? rules : [],
    })(<Select
      onChange={(value) => { onChange && onChange(value) }}
      onSearch={(value) => { onSearch && onSearch(value) }}
      allowClear={allowClear}
      showSearch={true}
      placeholder={placeholder}
      filterOption={(input, option: any) => {
        const str = option.props.children
        return str.indexOf(input) >= 0
      }}
    >
      {options && options.map((option, index) =>
        <Option key={index.toString()}
          value={optionValueKey && option[optionValueKey].toString()}
        >{optionLabelKey && option[optionLabelKey]}</Option>)}
    </Select>)
  }
  </FormItem>

export const RadioGroupItem = ({form, rules, id, formItemLayout, formItemLabel, options, optionValueKey, optionLabelKey }: IRadioGroupItemProps) =>
  <FormItem {...formItemLayout} label={formItemLabel} offset={8}>
  {
    form.getFieldDecorator(id.toString(), {
      rules: rules ? rules : [],
    })(<RadioGroup>
      {
        options && options.map((option) =>
          <Radio key={optionValueKey && option[optionValueKey].toString()} value={optionValueKey && option[optionValueKey].toString()}>{optionLabelKey && option[optionLabelKey]}</Radio>)
      }
    </RadioGroup>)
  }
  </FormItem>
