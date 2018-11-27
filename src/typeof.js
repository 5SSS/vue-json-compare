export const isArray = (item) => {
  return Object.prototype.toString.call(item) === '[object Array]'
}

export const isObject = (item) => {
  return Object.prototype.toString.call(item) === '[object Object]'
}

export const isNull = (item) => {
  return Object.prototype.toString.call(item) === '[object Null]'
}

export const isNumber = (item) => {
  return typeof item === 'number'
}

export const isString = (item) => {
  return typeof item === 'string'
}

export const isBoolean = (item) => {
  return typeof item === 'boolean'
}

export const isUndefined = (item) => {
  return typeof item === 'undefined'
}

export const type = (item) => {
  return Object.prototype.toString.call(item)
}
