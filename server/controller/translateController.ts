import { Logger } from 'winston'
import Koa from 'koa'
import { Controller, Get, TYPE, QueryParam, ResponseBody, Context } from '../inversifyKoa'
import { provideNamed, inject } from '../inversifyKoa/ioc'
import BaiduTranslateService from '../service/baiduTranslateService'
import WordLibaryDb from '../db/wordLibary'

@provideNamed(TYPE.Controller, 'TranslateController')
@Controller('/')
export default class TranslateController {

  @inject('logger')
  private logger: Logger

  @inject('BaiduTranslateService')
  private baiduTranslateService: BaiduTranslateService

  @inject('WordLibaryDb')
  private wordLibaryDb: WordLibaryDb

  /**
   * 翻译
   * @param {string} query
   * @returns
   * @memberof TranslateController
   */
  @Get('api/translate/baidu')
  @ResponseBody
  public async getTranslateBaidu (
    @QueryParam('query') query: string,
  ) {
    const libaryWord = await this.wordLibaryDb.getWord(query)
    if (libaryWord) {
      return libaryWord
    }
    const result = await this.baiduTranslateService.getTranslate(query)
    this.logger.info(`Get api/translate/baidu query = ${typeof query}: ${result}`)
    return result
  }

  /**
   * voice
   * @param {string} query
   * @param {Koa.Context} ctx
   * @memberof TranslateController
   */
  @Get('api/translate/voice')
  public async getTranslateWord (
    @QueryParam('query') query: string,
    @Context() ctx: Koa.Context,
  ) {
    const downloadStream = await this.wordLibaryDb.getVoice(query)
    ctx.set('Content-Type', 'audio/mp3')
    ctx.set('accept-ranges', 'bytes')
    ctx.body = downloadStream
  }

}
