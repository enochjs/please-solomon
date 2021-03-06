import * as React from 'react'
import { Row, Col } from 'antd'
import { chunk } from 'lodash'
import bibleContents from '../../config/bibleContents'

export default class BibleContent extends React.Component<any, any> {

  handleClick = (content) => {
    this.props.history.push(`/bible/book/${content.name}`)
  }

  render () {
    return [
      chunk(bibleContents, 3).map((item, index) => <Row key={index.toString()} className="bible-content">{
        item.map((content) => <Col key={content.name} span={8} onClick={() => this.handleClick(content)}>{content.name}</Col>)
      }</Row>),
    ]
  }
}
