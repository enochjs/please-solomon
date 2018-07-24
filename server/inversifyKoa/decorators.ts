import * as koa from 'koa'
import { interfaces } from './interfaces'
// import { errorFormat } from '../index'
import { METADATA_KEY, PARAMETER_TYPE } from './constants'

export function Controller (path = '', ...middleware: interfaces.Middleware[]) {
  return (target: any) => {
    const metadata: interfaces.IControllerMetadata = { path, middleware, target }
    Reflect.defineMetadata(METADATA_KEY.controller, metadata, target)
  }
}

export function Method (method: string, path: string, ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return (target: any, key: string) => {
    const metadata = { path, middleware, method, target, key }
    let metadataList: interfaces.IControllerMetadata[] = []

    if (!Reflect.hasOwnMetadata(METADATA_KEY.controllerMethod, target.constructor)) {
      Reflect.defineMetadata(METADATA_KEY.controllerMethod, metadataList, target.constructor)
    } else {
      metadataList = Reflect.getOwnMetadata(METADATA_KEY.controllerMethod, target.constructor)
    }

    metadataList.push(metadata)
  }
}

export function All (path: string, ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return Method('all', path, ...middleware)
}

export function Get (path: string, ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return Method('get', path, ...middleware)
}

export function Post (path: string, ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return Method('post', path, ...middleware)
}

export function Put (path: string, ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return Method('put', path, ...middleware)
}

export function Patch (path: string, ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return Method('patch', path, ...middleware)
}

export function Head (path: string, ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return Method('head', path, ...middleware)
}

export function Delete (path: string, ...middleware: interfaces.Middleware[]): interfaces.HandlerDecorator {
  return Method('delete', path, ...middleware)
}

export const Request = paramDecoratorFactory(PARAMETER_TYPE.REQUEST)
export const Response = paramDecoratorFactory(PARAMETER_TYPE.RESPONSE)
export const RequestParam = paramDecoratorFactory(PARAMETER_TYPE.PARAMS)
export const QueryParam = paramDecoratorFactory(PARAMETER_TYPE.QUERY)
export const RequestBody = paramDecoratorFactory(PARAMETER_TYPE.BODY)
export const RequestHeaders = paramDecoratorFactory(PARAMETER_TYPE.HEADERS)
export const Cookies = paramDecoratorFactory(PARAMETER_TYPE.COOKIES)
export const Session = paramDecoratorFactory(PARAMETER_TYPE.SESSION)
export const Next = paramDecoratorFactory(PARAMETER_TYPE.NEXT)
export const Context = paramDecoratorFactory(PARAMETER_TYPE.CTX)

function paramDecoratorFactory (parameterType: PARAMETER_TYPE): (name?: string) => ParameterDecorator {
  return (name?: string): ParameterDecorator => {
    const parmeterName = name || 'default'
    return Params(parameterType, parmeterName)
  }
}

export function Params (type: PARAMETER_TYPE, parameterName: string) {
  return function (target: object, methodName: string, index: number) {

    let metadataList: interfaces.IControllerParameterMetadata = {}
    let parameterMetadataList: interfaces.IParameterMetadata[] = []
    const parameterMetadata: interfaces.IParameterMetadata = {
      index,
      parameterName,
      type,
    }
    if (!Reflect.hasOwnMetadata(METADATA_KEY.controllerParameter, target.constructor)) {
      parameterMetadataList.unshift(parameterMetadata)
    } else {
      metadataList = Reflect.getOwnMetadata(METADATA_KEY.controllerParameter, target.constructor)
      if (metadataList.hasOwnProperty(methodName)) {
        parameterMetadataList = metadataList[methodName]
      }
      parameterMetadataList.unshift(parameterMetadata)
    }
    metadataList[methodName] = parameterMetadataList
    Reflect.defineMetadata(METADATA_KEY.controllerParameter, metadataList, target.constructor)
  }
}

// const Before = (reducer: (args: any, ctx: koa.Context, next: () => Promise<any>) => any[]) => (target: object, key: any) => {
//   if (key) {
//       Reflect.defineMetadata(METADATA_KEY.controllerAfter, reducer, target.constructor, key)
//   } else {
//       Reflect.defineMetadata(METADATA_KEY.controllerAfter, reducer, target.constructor)
//   }
// }

const After = (reducer: (result: Promise<any>, ctx: koa.Context, next: () => Promise<any>) => void) => (target: object, key: any) => {
  if (key) {
      Reflect.defineMetadata(METADATA_KEY.controllerAfter, reducer, target.constructor, key)
  } else {
      Reflect.defineMetadata(METADATA_KEY.controllerAfter, reducer, target.constructor)
  }
}

export const ResponseBody = After((result, ctx) => {
  if (result instanceof Error) {
    ctx.body = {
      status: 0,
      data: result.message ? result.message : result,
    }
  } else {
    ctx.body = {
      status: 1,
      data: result,
    }
  }
})
