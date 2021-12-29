import { isObject, hasOwn, def, isArray } from '../utils'
import { arrayMethods } from './array'

class Observer {
  constructor (value) {
    this.value = value
    def(value, '__ob__', this) // 把Observer实例通过__ob__属性（不可枚举 ，否则会导致循环引用问题）挂载到被观测的对象value上

    // 数组和对象要分开观测
    if (isArray(value)) {
      const agument = hasProto ? protoAgument : copyAgument
      agument(value, arrayMethods, arrayKeys)
      this.observeArray(value) // 要监测数组的每一项
    } else {
      this.walk(value)
    }
  }

  observeArray (array) {
    for (let i = 0; i < array.length; i++) {
      observe(array[i])
    }
  }

  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      defineReactive(obj, key, obj[key])
    }
  }
}

const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods) // 变异方法列表

// 将目标对象的__proto__指向源对象
// 如果存在__proto__，那么就将数组的__proto__指向arrayMethods，此时当调用变异方法时，会直接去其原型对象arrayMethods上去找，此时变异方法都通过AOP重写，当调用非变异方法时，会通过原型链直接取到Array.prototype上的原型方法（因为arrayMethods继承自Array.prototype）
function protoAgument (target, src) {
  target.__proto__ = src
}

// 如果不存在__proto__，那么直接将变异方法直接定义到实例上
function copyAgument (target, src, keys) {
  console.log(target, src, keys)
  for (let i = 0; i < keys.length; i++) {
    def(target, keys[i], src[keys[i]])
  }
}

export function defineReactive (obj, key, value) {
  observe(value)
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true, 
    get () {
      return value
    },
    set (newVal) {
      if (value === newVal) return
      observe(newVal)
      value = newVal
    }
  })
}

export function observe (data) {
  if (!isObject(data)) return // 只接受对象类型
  let ob
  if (hasOwn(data, '__ob__') && data.__ob__ instanceof Observer) {
    // 如果data有__ob__属性，并且data的__ob__属性是Observer的实例，表明已经观测过了，避免重复观测
    ob = data.__ob__
  } else {
    // 对未被观测的data进行观测
    ob = new Observer(data)
  }
  return ob
}
