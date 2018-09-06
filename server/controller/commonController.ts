import Koa from 'koa'
import * as fs from 'fs'
import * as profiler from 'v8-profiler'
import { Logger } from 'winston'
import { Controller, Get, Post, TYPE, Request, ResponseBody, QueryParam, Context } from '../inversifyKoa'
import { provideNamed, inject } from '../inversifyKoa/ioc'
import ImageDb from '../db/image'
import Config from '../config'

@provideNamed(TYPE.Controller, 'CommonController')
@Controller('/')
export default class CommonController {

  @inject('ImageDb')
  private imageDb: ImageDb

  @inject('Config')
  private config: Config

  @inject('logger')
  private logger: Logger

  /**
	 * 图片上传
	 * @param {Koa.Request} req
	 * @returns
	 * @memberof CommonController
	 */
  @Post('api/upload/image')
  @ResponseBody
  public async uploadImage (
    @Request() req: Koa.Request,
  ) {
    const file = req.files.file
    const result = await this.imageDb.uploadImg({
      name: file.name,
      url: file.path.slice(file.path.lastIndexOf('/') + 1),
      size: file.size,
      type: file.type,
    })
    this.logger.info('Post api/upload/image result: ', result)
    return result
  }

  /**
	 * 图片获取
	 * @param {string} id
	 * @param {Koa.Context} ctx
	 * @memberof CommonController
	 */

  @Get('api/image/url')
  public async getImageUrl (
    @QueryParam('id') id: string,
    @Context() ctx: Koa.Context,
  ) {
    const result = await this.imageDb.getImgById(id)
    const image = await fs.readFileSync(`${this.config.getImagePath()}${result.url}`)
    ctx.set('Content-Type', result.type)
    ctx.body = image
  }

  @Get('api/profiler')
  public async getProfiler (
    @Context() ctx: Koa.Context,
  ) {
    const duration = 3
    profiler.startProfiling('profile sample')
    const result = await await new Promise((re) => {
      setTimeout(() => {
        const profileData = profiler.stopProfiling()
        console.log(profileData.getHeader())
        profileData.export((err, data) => {
          if (err) {
              console.log(err)
          } else {
            fs.writeFileSync('profileData.cpuprofile', data)
            console.log('Dumping data done')
          }
          re(data)
          profileData.delete()
       })
      }, duration * 1000)
    })
    ctx.body = result
  }
}
