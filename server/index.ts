import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as koaStatic from 'koa-static'
import * as koaBody from 'koa-body'
import * as views from 'koa-views'
import * as path from 'path'
import * as session from 'koa-session'
import './utils/loader'

import {InversifyKoaServer } from './inversifyKoa'
import { container } from './inversifyKoa/ioc'
import Config from './config/index'
import uuid from './middleware/uuid'
import accesslogger from './middleware/accesslogger'
import html from './middleware/html'

const app = new Koa()
const router = new Router()
const config = container.get<Config>('Config')

// required for cookie signature generation
app.keys = ['newest secret key', 'older secret key']

const CONFIG = {
  key: 'koa:please-solomon', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
}

app.use(session(CONFIG, app))
// or if you prefer all default config, just use => app.use(session(app));

app.use(koaStatic(__dirname + '/static'))

app.use(uuid)

app.use(accesslogger)

app.use(koaBody({
  multipart: true, // 支持文件上传
  patchKoa: true,
  formidable: {
    uploadDir: config.getImagePath(), // 设置文件上传目录
    keepExtensions: true,    // 保持文件的后缀
    maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
    onFileBegin: (name, file) => { // 文件上传前的设置
      // console.log(`name: ${name}`);
      // console.log(file);
    },
  },
}))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './template'), {
  extension: 'ejs',
}))

const server = new InversifyKoaServer(container, router, null, app)

// register rooters
server.build().use(html).listen(config.getPort(), () => {
  console.log(`server start success! address ${config.getServerName()}`)
})
