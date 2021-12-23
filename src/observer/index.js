
class Observer {
  constructor (value) {
    this.value = value
  }

  walk (obj) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      defineReactive(obj, key, obj[key])
    }
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
  console.log(data)
}
