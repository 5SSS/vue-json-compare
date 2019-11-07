export default {
  isArray (item)  {
    return Object.prototype.toString.call(item) === '[object Array]'
  },
  isObject (item) {
    return Object.prototype.toString.call(item) === '[object Object]'
  },
  isNull (item)  {
    return Object.prototype.toString.call(item) === '[object Null]'
  },
  isNumber (item) {
    return typeof item === 'number'
  },
  isString (item) {
    return typeof item === 'string'
  },
  isBoolean (item)  {
    return typeof item === 'boolean'
  },
  isUndefined (item)  {
    return typeof item === 'undefined'
  },
  type (item) {
    let t = Object.prototype.toString.call(item)
    let match = /(?!\[).+(?=\])/g
    t = t.match(match)[0].split(' ')[1]
    return t
  }
}
