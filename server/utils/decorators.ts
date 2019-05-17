
const CONVERTPARAMKEY = Symbol('convertParamKey')
const ConvertArr = ['number', 'string']

const getType = (data: any) => {
  if (Array.isArray(data)) {
    return 'Array'
  }
  return typeof data
}

function convertArg (arg: any, config: any) {
  let convArg = arg
  switch (config.type) {
    case 'number':
      convArg = Number(arg)
      break
    case 'string':
      convArg = arg.toString()
      break
    default:
      break
  }
  return convArg
}

function convertArgs (args: any[], config: any): any[] {
  const configType = getType(config)
  if (configType === 'Array') {
    return args.map((item) => convertArgs(item, config[0]))
  } else {
    if (typeof args !== 'object' ) {
      return convertArg(args, config)
    } else {
      const keys = Reflect.ownKeys(args)
      keys.map((key) => {
        if (config[key] === undefined) {
          return
        }
        if (ConvertArr.includes(config[key].type)) {
          args[key] = convertArg(args[key], config[key])
        } else {
          args[key] = convertArgs(args[key], config[key])
        }
      })
      return args
    }
  }
}

export const Converter = () => (target: any, key: string, descriptor: PropertyDescriptor) => {
  const method = descriptor.value
  descriptor.value = function (...args: any[]) {
    const convertParams = Reflect.getOwnMetadata(CONVERTPARAMKEY, target, key)
    for (const convertParam of convertParams) {
      const index = convertParam.index
      const config: any = convertParam.config
      args[index] = convertArgs(args[index], config)
    }
    return method.apply(this, args)
  }
}

export const Convert = (config: any) => (target: any, key: string, paramIndex: number) => {
  const exitConfigs = Reflect.getOwnMetadata(CONVERTPARAMKEY, target, key) || []
  exitConfigs.push({ index: paramIndex, config: config || {} })
  Reflect.defineMetadata(CONVERTPARAMKEY, exitConfigs, target, key)
}

// const result = convertArgs(
//   [
//     {
//       id: '1',
//       name: 2,
//       list: [1, 2, 3, 4, 5, 6, 89],
//       list2: [{
//         id: '11',
//         name: 22,
//         test: [1, 2, 3, 4, 5],
//       }],
//     },
//     {
//       id: '11113333',
//       name: 12341212,
//       list: [1, 2, 3, 4, 5, 6],
//       list2: [{
//         id: '555555',
//         name: 1235443,
//         test: [1, 2, 3, 4, 5],
//       }],
//     },
//   ],
//   [
//     {
//       id: { type: 'number', required: true, msg: '参数必传'},
//       name: { type: 'string', required: true},
//       list: [{type: 'string'}],
//       list2: [{
//         id: { type: 'number', required: true},
//         name: { type: 'string', required: true},
//         test: [{type: 'string'}],
//       }],
//     },
//   ],
// )

// const formatValue = (type: string, value: any) => {
//   let formatedValue: any = value
//   switch (type) {
//     case 'number':
//       formatedValue = Number(value)
//       break
//     case 'string':
//       formatedValue = value.toString()
//       break
//     case 'Date':
//       formatedValue = new Date(value)
//       break
//     case 'string[]':
//       if (Array.isArray(value)) {
//         formatedValue = value.map((item: string | number) => item.toString())
//       } else {
//         throw new Error(`${value} is not a Array`)
//       }
//       break
//     default:
//       break
//   }
//   return formatedValue
// }

// export const filterDecorator = (params: {[key: string]: {type: string, required?: boolean}}) =>  (target: any, key: any, descriptor: any) => {
//   const originalMethod = descriptor ? descriptor.value : Object.getOwnPropertyDescriptor(target, key).value

//   descriptor.value = function (...args: any[]) {
//     const filteredArgs: any[] = []
//     args.map((arg, index: number) => {
//       let filterArg: any = {}
//       if (typeof arg === 'string') {
//         const validate: any = Object.keys(params)[index]
//         if (validate.required) {
//           if (arg === null || arg === undefined || arg === '') {
//             throw new Error(`${Object.keys(params)[index]} can not be null`)
//           }
//         }
//         filterArg = formatValue(validate.type, arg)
//       } else {
//         for (const i in params) {
//           if (params.hasOwnProperty(i)) {
//             if (params[i].required === true) {
//               if (arg[i] === null || arg[i] === undefined || arg[i] === '') {
//                 throw new Error(`${i} can not be null`)
//               }
//             }
//             if (arg[i] === null || arg[i] === undefined || arg[i] === '') {
//               arg[i] = null
//               continue
//             }
//             arg[i] = formatValue(params[i].type, arg[i])
//           }
//         }
//         for (const k in arg) {
//           if (arg[k] !== null) {
//             filterArg[k] = arg[k]
//           }
//         }
//       }
//       filteredArgs.push(filterArg)
//     })
//     return originalMethod.apply(this, filteredArgs)
//   }
//   return descriptor
// }
