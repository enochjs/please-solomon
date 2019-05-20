import { createLogger, transports, Logger, format } from 'winston'
import { TMiddleware } from 'monk'
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

export const mongoLogger: TMiddleware = () => (next: (args: {}, method: string) => Promise<any>) => (args: any, method: string) => {
  logger.info(`monk method ${method}, sql: ${JSON.stringify(args.query)}`)
  return next(args, method).then(function (result: any) {
    logger.info(`monk method ${method}, sql: ${JSON.stringify(args.query)}`, result)
    return result
  })
}
