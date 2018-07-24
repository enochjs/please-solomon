import { getMeta, Store } from 'redux-zero-x'

async function loggerMiddleware (action, next) {
  const meta = getMeta(action)
  console.group(`${meta.name}`)
  console.log('%cSTATE BEFORE:', 'color:#00B0FF', meta.store.state)
  await next()
  console.log('%cSTATE AFTER:', 'color:#43A047', meta.store.state)
  console.groupEnd()
}

Store.use(loggerMiddleware)
