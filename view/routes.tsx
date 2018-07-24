import * as React from 'react'
import { Route } from 'react-router'
import App from './container/index'
import ContactsList from './pages/contacts/list'
import ContactsDetail from './pages/contacts/detail'
import UserPendingList from './pages/user/pendingList'

const routes = (
  <App>
    {/** user */}
    <Route path="/user/pending/list" component={UserPendingList} />
    {/** contacts */}
    <Route path="/contacts/list" component={ContactsList} />
    <Route path="/contacts/detail" component={ContactsDetail} />
  </App>
)

export default routes
