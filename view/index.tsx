import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'redux-zero-x'
import { BrowserRouter } from 'react-router-dom'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN'

import store from './store'
import routes from './routes'

ReactDOM.render(
  <Provider {...store}>
    <BrowserRouter>
      <LocaleProvider locale={zh_CN}>
        {routes}
      </LocaleProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('please-container'))

if ((module as any).hot) { // 可以解决热更新失败的问题
  (module as any).hot.accept()
}
