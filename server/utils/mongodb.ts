import monk, { IMonkManager } from 'monk'
import { container } from '../inversifyKoa/ioc'
import Config from '../config/index'

const config = container.get<Config>('Config')

const db = monk(`${config.getMongoDB()}please`)

db.then(() => {
  console.log(`Connected correctly to server: ${config.getMongoDB()}please`)
})

container.bind<IMonkManager>('Mongodb').toConstantValue(db)
