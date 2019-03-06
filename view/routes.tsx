import * as React from 'react'
import { Route } from 'react-router'
import App from './container/index'
import ContactsList from './pages/contacts/list'
import ContactsDetail from './pages/contacts/detail'
import UserPendingList from './pages/user/pendingList'
import BibleContents from './pages/bible/contents'
import BibleDetail from './pages/bible/detail'

const routes = (
  <App>
    {/** user */}
    <Route path="/user/pending/list" component={UserPendingList} />
    {/** contacts */}
    <Route path="/contacts/list" component={ContactsList} />
    <Route path="/contacts/detail" component={ContactsDetail} />
    <Route path="/bible/contents" component={BibleContents} />
    <Route path="/bible/book/:book" component={BibleDetail} />
  </App>
)

export default routes
