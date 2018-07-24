import * as path from 'path'
import { provideSingleton } from '../inversifyKoa/ioc'

const ENV = process.env.NODE_ENV || 'localdev'

@provideSingleton('Config')
export default class Config {
  public getPort () {
    return {
      localdev: 7000,
    }[ENV]
  }

  public getServerName () {
    return {
      localdev: 'http://127.0.0.1:7000',
    }[ENV]
  }

  public getMongoDB () {
    return {
      localdev: 'mongodb://localhost:27017/please',
    }[ENV]
  }

  public getLogConfig () {
    return {
      localdev: path.resolve('./logs/please-solomon.log'),
    }[ENV]
  }

  public getImagePath () {
    return {
      localdev: path.join(__dirname, '../../../images/'), // 设置文件上传目录
    }[ENV]
  }
}
