import { v4 } from 'uuid'

export default async function uuid (ctx: any, next: () => Promise<any>)  {
    const uuids = v4()
    ctx.req.uuid = uuids
    ctx.res.setHeader('trace-id', uuids)
    await next()
}
