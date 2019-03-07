import * as React from 'react'
import { connect } from 'redux-zero-x'
import { Row, Col, Tooltip, Popconfirm } from 'antd'
import { chunk } from 'lodash'
import bibleArticles from '../../config/bibleArticles'
import bibleContents from '../../config/bibleContents'
import { IBibleStore } from './store'

import './index.less'

@connect('IBibleStore')
export default class BibleDetail extends React.Component<any, any> {

  constructor (props) {
    super(props)
    this.state = {
      left: 0,
      top: 0,
    }
  }

  handleDoubleClick = (e) => {
    const query = window.getSelection().toString()
    const clientX = e.clientX
    const clientY = e.clientY
    this.props.getTranslate({ query }, () => {
      this.setState({ left: clientX, top: clientY })
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
      <div className="translate-pop ant-popover ant-popover-placement-top" style={{ left: this.state.left, top: this.state.top }}>
        <div className="translate-pop-content ant-popover-content">
          <div className="ant-popover-arrow"></div>
          {this.props.data.translate.map((t) => <div>{t.dst}</div>)}
          {<audio src={this.props.data.voiceUrl} controls />}
        </div>
      </div>
      {
        [articles.map((item, index) => <div key={index.toString()} onDoubleClick={this.handleDoubleClick} className="mb10" style={{ textIndent: 20 }}>{item}</div>)]
      }
      <Popconfirm placement="topRight" title={'11111'} okText="Yes" cancelText="No" />
      </div>
  }
}
