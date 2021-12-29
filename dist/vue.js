(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function isFunction(value) {
    return typeof value === 'function';
  }
  function isObject(value) {
    return _typeof(value) === 'object' && value !== null;
  }
  var isArray = Array.isArray;
  function hasOwn(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }
  function def(obj, key, value) {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      writable: true,
      value: value
    });
  }

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);
  var patchToMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'reverse', 'sort'];
  patchToMethods.forEach(function (method) {
    var original = arrayProto[method]; // 获取Array.prototype上的元素方法 AOP

    def(arrayMethods, method, function mutator() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      // 为arrayMethods重新定义变异方法
      var result = original.apply.apply(original, [this].concat(args));
      var ob = this.__ob__;
      var inserted;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      } // 当method为push、unshit、splice时，它们可能会新增数据，也需要监测插入项


      if (inserted) {
        ob.observeArray(inserted);
      }

      return result;
    });
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      this.value = value;
      def(value, '__ob__', this); // 把Observer实例通过__ob__属性（不可枚举 ，否则会导致循环引用问题）挂载到被观测的对象value上
      // 数组和对象要分开观测

      if (isArray(value)) {
        var agument = hasProto ? protoAgument : copyAgument;
        agument(value, arrayMethods, arrayKeys);
        this.observeArray(value); // 要监测数组的每一项
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(array) {
        for (var i = 0; i < array.length; i++) {
          observe(array[i]);
        }
      }
    }, {
      key: "walk",
      value: function walk(obj) {
        var keys = Object.keys(obj);

        for (var i = 0; i < keys.length; i++) {
          var key = keys[i];
          defineReactive(obj, key, obj[key]);
        }
      }
    }]);

    return Observer;
  }();

  var hasProto = ('__proto__' in {});
  var arrayKeys = Object.getOwnPropertyNames(arrayMethods); // 变异方法列表
  // 将目标对象的__proto__指向源对象
  // 如果存在__proto__，那么就将数组的__proto__指向arrayMethods，此时当调用变异方法时，会直接去其原型对象arrayMethods上去找，此时变异方法都通过AOP重写，当调用非变异方法时，会通过原型链直接取到Array.prototype上的原型方法（因为arrayMethods继承自Array.prototype）

  function protoAgument(target, src) {
    target.__proto__ = src;
  } // 如果不存在__proto__，那么直接将变异方法直接定义到实例上


  function copyAgument(target, src, keys) {
    console.log(target, src, keys);

    for (var i = 0; i < keys.length; i++) {
      def(target, keys[i], src[keys[i]]);
    }
  }

  function defineReactive(obj, key, value) {
    observe(value);
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        return value;
      },
      set: function set(newVal) {
        if (value === newVal) return;
        observe(newVal);
        value = newVal;
      }
    });
  }
  function observe(data) {
    if (!isObject(data)) return; // 只接受对象类型

    var ob;

    if (hasOwn(data, '__ob__') && data.__ob__ instanceof Observer) {
      // 如果data有__ob__属性，并且data的__ob__属性是Observer的实例，表明已经观测过了，避免重复观测
      ob = data.__ob__;
    } else {
      // 对未被观测的data进行观测
      ob = new Observer(data);
    }

    return ob;
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm, opts.data);
    }
  } // 代理
  // 当用户直接通过vm[prop]会将用户代理到vm._data[prop]上，取值、存值都进行代理。

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
  } // 初始化data


  function initData(vm, data) {
    // Vue中data类型只能是函数和对象，只有根组件是对象，其他都是返回函数的对象
    // 当一个组件被定义，data必须声明为返回一个初始数据对象的函数，因为组件可能被用来创建多个实例。如果data仍然是一个纯粹的对象，则所有实例将共享引用同一个数据对象！通过提供data函数，每次创建一个新实例后，我们能够调用data函数，从而返回一个全新副本数据对象。
    data = vm.$data = isFunction(data) ? data.call(vm) : data; // 将data添加到Vue实例_data属性上
    // 观测数据的变化

    observe(data); // 把data里面的属性都代理到vm上

    var keys = Object.keys(data);

    for (var i = 0; i < keys.length; i++) {
      proxyData(vm, '$data', keys[i]);
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      initState(vm); // 初始化状态
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // 逻辑分离，为Vue添加实例方法_init

  return Vue;

}));
//# sourceMappingURL=vue.js.map
