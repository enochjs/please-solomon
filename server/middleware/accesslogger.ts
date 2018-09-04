import { container } from '../inversifyKoa/ioc'
import { Logger } from 'winston'

export default async function accesslogger (ctx: any, next: () => Promise<any>)  {
  if (!ctx.path.includes('_next') && !ctx.path.includes('static')) {
    const startTime = Date.now()
    const logger = container.get<Logger>('logger')
    logger.info(`================   ${ctx.req.session}   start ${ctx.req.uuid}  ${ctx.req.method} ${ctx.req.url}      ================`)
    ctx.res.on('finish', () => {
        const cost = Date.now() - startTime
        logger.info(`================ ${ctx.req.session} end ${ctx.req.uuid}  ${ctx.req.method} ${ctx.req.url} ${ctx.res.statusCode} - ${cost} ms ================`)
    })
  }
  await next()
}
