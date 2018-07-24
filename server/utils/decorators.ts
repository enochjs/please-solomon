
const formatValue = (type: string, value: any) => {
  let formatedValue: any = value
  switch (type) {
    case 'number':
      formatedValue = Number(value)
      break
    case 'string':
      formatedValue = value.toString()
      break
    case 'Date':
      formatedValue = new Date(value)
      break
    case 'string[]':
      if (Array.isArray(value)) {
        formatedValue = value.map((item: string | number) => item.toString())
      } else {
        throw new Error(`${value} is not a Array`)
      }
      break
    default:
      break
  }
  return formatedValue
}

export const filterDecorator = (params: {[key: string]: {type: string, required?: boolean}}) =>  (target: any, key: any, descriptor: any) => {
  const originalMethod = descriptor ? descriptor.value : Object.getOwnPropertyDescriptor(target, key).value

  descriptor.value = function (...args: any[]) {
    const filteredArgs: any[] = []
    args.map((arg, index: number) => {
      let filterArg: any = {}
      if (typeof arg === 'string') {
        const validate: any = Object.keys(params)[index]
        if (validate.required) {
          if (arg === null || arg === undefined || arg === '') {
            throw new Error(`${Object.keys(params)[index]} can not be null`)
          }
        }
        filterArg = formatValue(validate.type, arg)
      } else {
        for (const i in params) {
          if (params.hasOwnProperty(i)) {
            if (params[i].required === true) {
              if (arg[i] === null || arg[i] === undefined || arg[i] === '') {
                throw new Error(`${i} can not be null`)
              }
            }
            if (arg[i] === null || arg[i] === undefined || arg[i] === '') {
              arg[i] = null
              continue
            }
            arg[i] = formatValue(params[i].type, arg[i])
          }
        }
        for (const k in arg) {
          if (arg[k] !== null) {
            filterArg[k] = arg[k]
          }
        }
      }
      filteredArgs.push(filterArg)
    })
    return originalMethod.apply(this, filteredArgs)
  }
  return descriptor
}
