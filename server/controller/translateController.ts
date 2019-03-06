import { Logger } from 'winston'
import { Controller, Get, TYPE, QueryParam, ResponseBody } from '../inversifyKoa'
import { provideNamed, inject } from '../inversifyKoa/ioc'
import BaiduTranslateService from '../service/baiduTranslateService'

@provideNamed(TYPE.Controller, 'TranslateController')
@Controller('/')
export default class TranslateController {

  @inject('logger')
  private logger: Logger

  @inject('BaiduTranslateService')
  private baiduTranslateService: BaiduTranslateService

  @Get('api/translate/baidu')
  @ResponseBody
  public async getPendingList (
    @QueryParam('query') query: string,
  ) {
    const result = await this.baiduTranslateService.getTranslate(query)
    this.logger.info(`Get api/translate/baidu query = ${typeof query}: ${result}`)
    return result
  }

}
