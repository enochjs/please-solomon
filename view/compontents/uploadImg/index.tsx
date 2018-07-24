import React, { Component } from 'react'
import { Upload, Icon, Modal  } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { isEqual } from 'lodash'
import { getImgUrl } from '../../utils'

interface IUploadImgProps {
  src: string[],
  maxLen?: number
}

interface IUploadImgState {
  previewVisible: boolean,
  previewImage: string,
  fileList: UploadFile[],
}

export default class UploadImg extends Component<IUploadImgProps, IUploadImgState> {

  constructor (props: IUploadImgProps) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
  }

  componentDidMount () {
    const fileList = []
    this.props.src.map((item, index: number) => {
      fileList.push({
        uid: index,
        status: 'done',
        url: getImgUrl(item),
      })
    })
    this.setState({ fileList })
  }

  componentDidUpdate (prevProps: IUploadImgProps, prevState: IUploadImgState) {
    if (!isEqual(prevProps.src, this.props.src)) {
      const fileList = []
      this.props.src.map((item, index: number) => {
        fileList.push({
          uid: index,
          status: 'done',
          url: getImgUrl(item),
        })
      })
      this.setState({ fileList })
    }
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    })
  }

  handleCancel = () => this.setState({ previewVisible: false })

  handleChange = ({ fileList }) => this.setState({ fileList })

  getImageList = () => {
    const imageList = []
    this.state.fileList.map((field) => {
      if (field.url) {
        imageList.push(field.url.split('id=')[1])
      } else if (field.response) {
        imageList.push(field.response.data)
      }
    })
    return imageList
  }

  render () {
    const { previewVisible, previewImage, fileList } = this.state
    const { maxLen } = this.props
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    )
    return (
      <div className="clearfix">
        <Upload
          action="/api/upload/image"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {maxLen && fileList.length >= maxLen ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}
