(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function isFunction(value) {
    return typeof value === 'function';
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm, opts.data);
    }
  }

  function proxyData(target, source, key) {
    Object.defineProperty(target, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        return target[source][key];
      },
      set: function set(newVal) {
        target[source][key] = newVal;
      }
    });
  }

  function initData(vm, data) {
    // Vue中data类型只能是函数和对象，只有根组件是对象，其他都是返回函数的对象
    data = vm._data = isFunction(data) ? data.call(vm) : data;

    var keys = Object.keys(data);

    for (var i = 0; i < keys.length; i++) {
      proxyData(vm, '_data', keys[i]);
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
