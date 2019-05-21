import { Logger } from 'winston'
import { Controller, Get, Post, Put, Delete, TYPE, QueryParam, RequestParam, ResponseBody, RequestBody } from '../inversifyKoa'
import { provideNamed, inject } from '../inversifyKoa/ioc'
import UserDb from '../db/user'

@provideNamed(TYPE.Controller, 'UserController')
@Controller('/')
export default class UserController {

  @inject('logger')
  private logger: Logger

  @inject('UserDb')
  private userDb: UserDb

  @Get('api/user/list')
  @ResponseBody
  public async getUserList (
    @QueryParam('name') name: string,
    @QueryParam('mobile') mobile: number,
    @QueryParam('idCard') idCard: string,
    @QueryParam('sex') sex: number,
  ) {
    const userList = await this.userDb.getUserList({ name, mobile, idCard, sex})
    this.logger.info(`Get api/user/list name = ${typeof userList}`)
    return {
      list: userList,
      currentPage: 1,
      pageSize: 1,
      count: userList.length,
    }
  }

  /**
	 * 新增用户
	 * @param {number} id
	 * @param {string} name
	 * @param {number} mobile
	 * @param {string} birthday
	 * @param {string} idCard
	 * @param {number} sex
	 * @param {number} height
	 * @param {number} weight
	 * @param {string} images
	 * @param {string} introduce
	 * @returns
	 * @memberof UserController
	 */
  @Post('api/user/add')
  @ResponseBody
  public async useAdd (
    @RequestBody('name') name: string,
    @RequestBody('mobile') mobile: number,
    @RequestBody('birthday') birthday: string,
    @RequestBody('idCard') idCard: string,
    @RequestBody('sex') sex: number,
    @RequestBody('height') height: number,
    @RequestBody('weight') weight: number,
    @RequestBody('images') images: string,
    @RequestBody('introduce') introduce: string,
  ) {
    const result = await this.userDb.addUser({
      name,
      mobile,
      birthday,
      idCard,
      sex,
      height,
      weight,
      images: images.split(','),
      introduce,
      operator: 'admin',
    })
    return result
  }

  /**
   * 用户更新
   * @param {string} _id
   * @param {string} name
   * @param {number} mobile
   * @param {string} birthday
   * @param {string} idCard
   * @param {number} sex
   * @param {number} height
   * @param {number} weight
   * @param {string} images
   * @param {string} introduce
   * @returns
   * @memberof UserController
   */
  @Put('api/user/update')
  @ResponseBody
  public async useUpdate (
    @RequestBody('_id') _id: string,
    @RequestBody('name') name: string,
    @RequestBody('mobile') mobile: number,
    @RequestBody('birthday') birthday: string,
    @RequestBody('idCard') idCard: string,
    @RequestBody('sex') sex: number,
    @RequestBody('height') height: number,
    @RequestBody('weight') weight: number,
    @RequestBody('images') images: string,
    @RequestBody('introduce') introduce: string,
  ) {
    const result = await this.userDb.updateUser({
      _id,
      name,
      mobile,
      birthday,
      idCard,
      sex,
      height,
      weight,
      images: images.split(','),
      introduce,
      operator: 'admin',
    })
    return result
  }

  @Delete('api/user/delete/:_id')
  @ResponseBody
  public async useDelete (
    @RequestParam('_id') _id: string,
  ) {
    const result = await this.userDb.delUserList(_id)
    return result
  }

}
