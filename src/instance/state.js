import { isFunction } from '../utils'
import { observe } from '../observer'

export function initState (vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm, opts.data)
  }
}

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

function initData (vm, data) {
  // Vue中data类型只能是函数和对象，只有根组件是对象，其他都是返回函数的对象
  data = vm._data = isFunction(data) ? data.call(vm) : data
  observe(data)

  // 把data里面的属性都代理到vm上
  const keys = Object.keys(data)
  for (let i = 0; i < keys.length; i++) {
    proxyData(vm, '_data', keys[i])
  }
}
