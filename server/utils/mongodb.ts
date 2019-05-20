import monk, { IMonkManager } from 'monk'
import { mongoLogger } from './logger'
import { container } from '../inversifyKoa/ioc'
import Config from '../config/index'

const config = container.get<Config>('Config')

const db = monk(`${config.getMongoDB()}please`)

db.addMiddleware(mongoLogger)

db.then(() => {
  console.log(`Connected correctly to server: ${config.getMongoDB()}please`)
})

container.bind<IMonkManager>('Mongodb').toConstantValue(db)
