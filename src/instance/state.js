import { isFunction } from '../utils'
import { observe } from '../observer'

export function initState (vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm, opts.data)
  }
}

// 代理
// 当用户直接通过vm[prop]会将用户代理到vm._data[prop]上，取值、存值都进行代理。
function proxyData (target, source, key) {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get () {
      return target[source][key]
    },
    set (newVal) {
      target[source][key] = newVal
    }
  })
}

// 初始化data
function initData (vm, data) {
  // Vue中data类型只能是函数和对象，只有根组件是对象，其他都是返回函数的对象
  // 当一个组件被定义，data必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。如果data仍然是一个纯粹的对象，则所有实例将共享引用同一个数据对象！通过提供data函数，每次创建一个新实例后，我们能够调用data函数，从而返回一个全新副本数据对象。
  data = vm.$data = vm._data = isFunction(data) ? data.call(vm) : data // 将data添加到Vue实例_data属性上

  // 观测数据的变化
  observe(data)

  // 把data里面的属性都代理到vm上
  const keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    proxyData(vm, '_data', keys[i])
  }
}
