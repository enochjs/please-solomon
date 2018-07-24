import { Context } from 'koa'
import Config from '../config'
import { container } from '../inversifyKoa/ioc'

const ENV = process.env.NODE_ENV || 'localdev'
const config = container.get<Config>('Config')

export default async function html (ctx: Context)  {
  let main = `${config.getServerName()}/main.js`
  if (ENV === 'localdev') {
    main = `http://127.0.0.1:7012/main.js`
  }
  const CONSTANTS: any = {
    STATUS: [
      { code: '', mean: '全部' },
      { code: 3, mean: '变更' },
      { code: 1, mean: '新增' },
      { code: 2, mean: '更新' },
    ],
  }
  ctx.body = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
			<title>please-solomon</title>
		</head>
		<body>
				<div id="please-container"></div>
				<script>window.CONSTANTS=${JSON.stringify(CONSTANTS)};window.env='${ENV}'</script>
				<script src="${main}"></script>
		</body>
		</html>
	`
}
