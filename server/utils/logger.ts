import { createLogger, transports, Logger, format } from 'winston'
import { container } from '../inversifyKoa/ioc'
import Config from '../config'

const { combine, timestamp, json } = format
const config = container.get<Config>('Config')

const transportsConfig: any[] = [new transports.File({
  filename: config.getLogConfig(),
  level: 'info',
})]

if (process.env.NODE_ENV === 'localdev') {
  transportsConfig.push(
    new transports.Console({
      format: format.simple(),
    }),
  )
}

const logger: Logger = createLogger({
  transports: transportsConfig,
  format: combine(
    timestamp({format: 'YYYY-MM-DD HH:mm:ss.SSS'}),
    json(),
  ),
})

container.bind<Logger>('logger').toConstantValue(logger)
