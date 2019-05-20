import * as React from 'react'
import { connect } from 'redux-zero-x'
import { Row, Col, Popconfirm } from 'antd'
import bibleArticles from '../../config/bibleArticles'
import bibleContents from '../../config/bibleContents'
import ReactAudio from '../../compontents/reactAudio'

import './index.less'
@connect(['bibleStore'])
export default class BibleDetail extends React.Component<any, any> {

  constructor (props) {
    super(props)
    this.state = {
      left: 0,
      top: 0,
      display: 'none',
    }
  }

  reactaudio: any

  listener: any

  componentDidMount () {
    this.listener = document.addEventListener('click', (e: any) => {
      if (e.target.closest('.translate-pop')) {
        return
      }
      this.setState({ display: 'none' })
    })
  }

  componentWillUnmount = () => {
    this.listener && document.removeEventListener('click', this.listener)
  }

  handleDoubleClick = (e) => {
    const query = window.getSelection().toString()
    const clientX = e.clientX
    const clientY = e.clientY
    this.props.getTranslate({ query }, () => {
      this.setState({ left: clientX, top: clientY, display: '' })
    })
  }

  render () {
    const book = this.props.match.params.book
    const length = book ? bibleContents.find((item) => item.name === book).length : 0
    const articles = []
    for (let i = 0; i < length; i++) {
      articles.push(bibleArticles[`${book}-${i + 1}`])
    }
    return <div className="bible-detail">
      <h2 className="text-center">{book}</h2>
      <div
        className="translate-pop ant-popover ant-popover-placement-top"
        style={{ left: this.state.left, top: this.state.top, display: this.state.display }}
      >
        <div className="translate-pop-content ant-popover-content">
          <div className="ant-popover-arrow"></div>
          <Row>
            <Col span={16}>{this.props.data.explanation}</Col>
            <Col span={8}>
              <ReactAudio
                ref={(r) => this.reactaudio = r}
                musiclist={[{ src: this.props.data.voiceUrl || '', lrc: [] }]}
                size="small"
                showTime={false}
                audioId={`reactaudio`}
              />
            </Col>
          </Row>
        </div>
      </div>
      {
        [articles.map((item, index) => <div key={index.toString()} onDoubleClick={this.handleDoubleClick} className="mb10" style={{ textIndent: 20 }}>{item}</div>)]
      }
      <Popconfirm placement="topRight" title={''} okText="Yes" cancelText="No" />
    </div>
  }
}
