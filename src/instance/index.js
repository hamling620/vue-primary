import { initMixin } from './init'

function Vue (options) {
  this._init(options)
}

initMixin(Vue) // 逻辑分离，为Vue添加实例方法_init

export default Vue
