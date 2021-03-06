import * as React from 'react'
import { connect } from 'redux-zero-x'
import { Modal, Form, Input, Radio, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import { Moment } from 'moment'
import { mobileReg, idCardReg } from '../../utils/regExp'
import UploadImg from '../../compontents/uploadImg'
import { IUserListStore } from './store'

import './index.less'

const FormItem = Form.Item
const TextArea = Input.TextArea
const RadioGroup = Radio.Group

export interface IFormValue {
  _id?: number
  name?: string
  mobile?: string
  birthday?: Moment
  idCard?: string
  sex?: number
  height?: number
  weight?: number
  images?: string[]
  introduce?: string
}

interface IAddEditOwnProps {
  formValue: IFormValue
  cacheInstance: (instance) => any,
  query: Function
}

export interface IAddEditProps extends IAddEditOwnProps, FormComponentProps, IUserListStore {}

@connect(['userListStore'])
export class AddEdit extends React.Component<IAddEditProps, any> {

  constructor (props: IAddEditProps) {
    super(props)
    this.state = {
      visible: false,
    }
  }

  uploadImg: UploadImg

  componentDidMount () {
    const { cacheInstance } = this.props
    cacheInstance(this)
  }

  show = () => {
    this.setState({ visible: true })
  }

  hide = () => {
    this.setState({ visible: false })
  }

  handleOk = () => {
    const { addUser, form, updateUser, formValue, query } = this.props
    form.validateFieldsAndScroll((err: Error, values: IFormValue) => {
      if (!err) {
        if (formValue._id) {
          updateUser({
            ...values,
            _id: formValue._id,
            birthday: values.birthday.format('YYYY-MM-DD HH:mm:ss'),
            images: this.uploadImg.getImageList(),
          }).then(() => {
            this.hide()
            query()
          })
        } else {
          addUser({
            ...values,
            birthday: values.birthday.format('YYYY-MM-DD HH:mm:ss'),
            images: this.uploadImg.getImageList(),
          }).then(() => {
            this.hide()
            query()
          })
        }
      }
    })
  }

  handleCancel = () => {
    this.hide()
  }

  validateMobile = (rule, value, callback) => {
    if (value && !mobileReg.test(value)) {
      callback('手机号码格式不正确！')
    }
    callback()
  }

  validateIdCard = (rule, value, callback) => {
    if (value && !idCardReg.test(value)) {
      callback('身份证格式不正确！')
    }
    callback()
  }

  render () {
    const { form, formValue } = this.props
    const { getFieldDecorator } = form
    const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 10 } }
    return (
      <Modal
        title="新增"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
        width={600}
        className={'pending-list-modal'}
      >
        <Form>
          <FormItem {...formItemLayout} label="id">
            <Input value={formValue._id} disabled />
          </FormItem>
          <FormItem {...formItemLayout} label="姓名">
            {
              getFieldDecorator('name', { rules: [{ required: true, min: 2, max: 5, message: 'Please input your name!' }] })(
                <Input type="text" />)
            }
          </FormItem>
          <FormItem {...formItemLayout} label="电话" >
            {
              getFieldDecorator('mobile', { rules: [{ required: true }, { validator: this.validateMobile }] })(
                <Input type="number" />,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="出生年月">
            {
              getFieldDecorator('birthday', { rules: [{ required: true }] })(
                <DatePicker />,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="身份证">
            {
              getFieldDecorator('idCard', { rules: [{ required: true }, { validator: this.validateIdCard }] })(
                <Input type="text" />,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="性别">
            {
              getFieldDecorator('sex', { initialValue: 1 })(
                <RadioGroup>
                  <Radio value={1}>男</Radio>
                  <Radio value={2}>女</Radio>
                </RadioGroup>,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="身高(cm)">
            {
              getFieldDecorator('height', { rules: [{ required: true, message: 'Please input your height!' }] })(
                <Input type="number" />,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="体重(kg)">
            {
              getFieldDecorator('weight', { rules: [{ required: true, message: 'Please input your weight!' }] })(
                <Input type="number" />,
              )
            }
          </FormItem>
          <FormItem {...formItemLayout} label="图片">
            {
              <UploadImg ref={(r) => this.uploadImg = r} src={formValue.images} maxLen={3} />
            }
          </FormItem>
          <FormItem {...formItemLayout} label="介绍">
            {
              getFieldDecorator('introduce')(
                <TextArea />,
              )
            }
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

interface IFormProps extends IAddEditOwnProps, FormComponentProps {}

export default (Form.create({
  onFieldsChange (props, changedFields) {
    // props.onChange(changedFields);
  },
  mapPropsToFields (props: IAddEditProps) {
    const fields = {}
    for (const key in props.formValue) {
      if (props.formValue.hasOwnProperty(key)) {
        fields[key] = Form.createFormField({ value: props.formValue[key] })
      }
    }
    return fields
  },
})<any>(AddEdit)) as any
