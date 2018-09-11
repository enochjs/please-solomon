import Koa from 'koa'
import { Logger } from 'winston'
import { Controller, Get, Post, TYPE, Context, ResponseBody, RequestBody, Session } from '../inversifyKoa'
import { provideNamed, inject } from '../inversifyKoa/ioc'
import UserDb from '../db/user'

@provideNamed(TYPE.Controller, 'LoginController')
@Controller('/')
export default class LoginController {

  @inject('logger')
  private logger: Logger

  @inject('UserDb')
  private userDb: UserDb

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
    @RequestBody('username') username: 'string',
    @RequestBody('password') password: 'string',
    @Session() session: any,
  ) {
    this.logger.info('Post login/check', username, password)
    const result = await this.userDb.checkUser(username, password)
    this.logger.info('Post login/check', result, session)
    if (result) {
      session.loginUserName = username
      return true
    }
    return false
  }

}
