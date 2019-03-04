import * as koa from 'koa'
import * as Router from 'koa-router'
import { interfaces as inversifyInterfaces } from 'inversify'
import { PARAMETER_TYPE } from './constants'

declare namespace interfaces {

  export type Middleware = (inversifyInterfaces.ServiceIdentifier<any> | KoaRequestHandler)

  export interface IControllerMetadata {
    path: string
    middleware: Middleware[]
    target: any
  }

  export interface IControllerMethodMetadata extends IControllerMetadata {
    method: string
    key: string
  }

  export interface IControllerParameterMetadata {
    [methodName: string]: IParameterMetadata[]
  }

  export interface IParameterMetadata {
    parameterName: string
    index: number
    type: PARAMETER_TYPE
  }

  export type BeforeMetadata = (args: any[], ctx: Router.IRouterContext, next: KoaRequestHandler) => any[]

  export type AfterMetadata = (result: any | Promise<any>, ctx: Router.IRouterContext, next: KoaRequestHandler) => any | Promise<any>

  export interface IController {}

  export type HandlerDecorator = (target: any, key: string, value: any) => void

  export type ConfigFunction = (app: koa) => void

  export interface IRoutingConfig {
    rootPath: string
  }

  export type KoaRequestHandler = (ctx: Router.IRouterContext, next: () => Promise<any>) => any

  export interface INextFunction {
    next: () => Promise<any>
  }
}

export { interfaces }
