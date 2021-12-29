import { def } from '../utils'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)

const patchToMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'reverse',
  'sort'
]

patchToMethods.forEach(method => {
  const original = arrayProto[method] // 获取Array.prototype上的元素方法 AOP
  def(arrayMethods, method, function mutator (...args) { // 为arrayMethods重新定义变异方法
    const result = original.apply(this, ...args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
      default:
        break
    }

    // 当method为push、unshit、splice时，它们可能会新增数据，也需要监测插入项
    if (inserted) {
      ob.observeArray(inserted)
    }
    return result
  })
})