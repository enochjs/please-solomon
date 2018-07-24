import Koa from 'koa'
import { Logger } from 'winston'
import { Controller, Get, Post, TYPE, Request, ResponseBody, QueryParam, Context } from '../inversifyKoa'
import { provideNamed, inject } from '../inversifyKoa/ioc'
import Config from '../config'

@provideNamed(TYPE.Controller, 'LoginController')
@Controller('/')
export default class LoginController {

  @inject('Config')
  private config: Config

  @inject('logger')
  private logger: Logger

  @Get('login')
  public async login (
    @Context() ctx: Koa.Context,
  ) {
    await ctx.render('login', {
      title: 'home page',
    })
  }
}
