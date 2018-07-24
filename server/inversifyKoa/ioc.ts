import { Container, inject, injectable } from 'inversify'
import { autoProvide, makeProvideDecorator, makeFluentProvideDecorator } from 'inversify-binding-decorators'
import getDecorators from 'inversify-inject-decorators'
const container = new Container()
const { lazyInject } = getDecorators(container)

const provide = makeProvideDecorator(container)
const fluentProvider = makeFluentProvideDecorator(container)

const provideNamed = function (identifier: any, name: string) {
  return fluentProvider(identifier)
    .whenTargetNamed(name)
    .done()
}

const provideSingleton = function (identifier: any) {
  return fluentProvider(identifier)
    .inSingletonScope()
    .done()
}

export { container, autoProvide, provide, provideSingleton, provideNamed, inject, lazyInject, injectable }
