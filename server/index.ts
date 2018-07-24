import * as Koa from 'koa'
import * as Router from 'koa-router'
import * as koaStatic from 'koa-static'
import * as koaBody from 'koa-body'
import './utils/loader'

import {InversifyKoaServer } from './inversifyKoa'
import { container } from './inversifyKoa/ioc'
import Config from './config/index'
import html from './utils/html'

const app = new Koa()
const router = new Router()
const config = container.get<Config>('Config')

app.use(koaStatic(__dirname + '/static'))

console.log('config.getImagePath()>>>>', config.getImagePath())

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

const server = new InversifyKoaServer(container, router, null, app)

// register rooters
server.build().use(html).listen(config.getPort(), () => {
  console.log(`server start success! address ${config.getServerName()}`)
})
