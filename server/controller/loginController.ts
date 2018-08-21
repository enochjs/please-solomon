import Koa from 'koa'
import { Logger } from 'winston'
import { Controller, Get, Post, TYPE, Context, ResponseBody, RequestBody } from '../inversifyKoa'
import { provideNamed, inject } from '../inversifyKoa/ioc'
import AuthDb from '../db/auth'

@provideNamed(TYPE.Controller, 'LoginController')
@Controller('/')
export default class LoginController {

  @inject('logger')
  private logger: Logger

  @inject('AuthDb')
  private authDb: AuthDb

  /**
   * login
   * @param {Koa.Context} ctx
   * @memberof LoginController
   */
  @Get('login')
  public async login (
    @Context() ctx: Koa.Context,
  ) {
    await ctx.render('login', {
      title: 'home page',
    })
  }

  @Post('login/check')
  @ResponseBody
  public async loginCheck (
    @RequestBody() username: 'string',
    @RequestBody() password: 'string',
    @Context() ctx: Koa.Context,
  ) {
    this.logger.info('Post login/check', username, password)
    const result = await this.authDb.checkUser(username, password)
    this.logger.info('Post login/check', result)
    if (result) {
      ctx.redirect('/')
    }
    return false
  }

}
