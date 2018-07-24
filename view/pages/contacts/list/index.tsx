import * as React from 'react'
import { connect } from 'redux-zero-x'
import { message } from 'antd'
import { ContatcsStore } from '../store'

export interface IProps extends ContatcsStore {
  data: string
}

@connect('ContatcsStore')
export default class List extends React.Component<IProps, any> {

  constructor (props) {
    super(props)
    this.state = {
      content: 'hello world list',
    }
  }

  componentWillMount () {
    const { getHelloWorld } = this.props
    getHelloWorld({ name: 'enochjs' })
  }

  render () {
    const { data } = this.props
    return (
      <div>
        {data || this.state.content}
      </div>
    )
  }
}
