export function isFunction (value) {
  return typeof value === 'function'
}

export function isObject (value) {
  return typeof value === 'object' && value !== null
}

export const isArray = Array.isArray

export function hasOwn (obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

export function def (obj, key, value) {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable: true,
    value
  })
}
