import * as React from 'react'
import { withRouter, MemoryRouter } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'

import { menuList } from '../config'
import './index.less'

const { Header, Footer, Sider, Content } = Layout
const SubMenu = Menu.SubMenu

class App extends React.Component<any, any> {

  constructor (props: any) {
    super(props)
    this.state = {
      currentKey: '/contacts/list',
    }
  }

  handleClickMenu = (e: any) => {
    this.props.history.push(e.key)
    this.setState({ currentKey: e.key })
  }

  render () {
    return (
      <Layout>
        <Sider
          collapsible
        >
          <div className="logo" />
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[this.state.currentKey]}
            onClick={this.handleClickMenu}
          >
            {
              menuList.map((menu, index) => {
                if (menu.children) {
                  return (
                    <SubMenu
                      key={index}
                      title={<span><Icon type={menu.icon} /><span>{menu.name}</span></span>}
                    >
                      {
                        menu.children.map((subMenu) => <Menu.Item key={subMenu.url}><span>{subMenu.name}</span></Menu.Item>)
                      }
                    </SubMenu>
                  )
                } else {
                  return (
                    <Menu.Item key={menu.url}>
                      <Icon type={menu.icon} />
                      <span>{menu.name}</span>
                    </Menu.Item>
                  )
                }
              })
            }
          </Menu>
        </Sider>
        <Layout>
          <Header>please-solomon</Header>
          <Content>{this.props.children}</Content>
        </Layout>
      </Layout>

    )
  }
}

export default withRouter(App)
