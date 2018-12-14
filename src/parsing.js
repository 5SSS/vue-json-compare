import { isObject, isArray, isString, type } from './typeof.js'

let _line = 1

const parseData = (source) => {
  _line = 1
  let newData = []
  if (isObject(source)) {
    newData = parseObject(source)
  } else if (isArray(source)) {
    newData = parseArray(source)
  } else {
    return [{key: '', value: 'error: data should be an Object or Array type', type: 'String', line: '1'}]
  }
  return newData
}

const parseObject = (obj) => {
  let newData = []
  for (let key in obj) {
    let newObj = Object.create(null)
    newObj.type = type(obj[key])
    newObj.line = _line++
    newObj.key = key
    if (isObject(obj[key])) {
      newObj.value = parseObject(obj[key], _line)
      newObj.lastLine = _line++
      newObj.show = true
    } else if (isArray(obj[key])) {
      newObj.value = parseArray(obj[key], _line)
      newObj.lastLine = _line++
      newObj.show = true
    } else {
      if (obj[key] === null) {
        newObj.value = 'null'
      } else if (obj[key] === undefined) {
        newObj.value = 'undefined'
      } else {
        if (isString(obj[key])) {
          newObj.value = '"' + obj[key] + '"'
        } else {
          newObj.value = obj[key]
        }
      }
    }
    newData.push(newObj)
  }
  return newData
}

const parseArray = (arr) => {
  let newData = []
  for (let i = 0; i < arr.length; i++) {
    let newObj = Object.create(null)
    newObj.type = type(arr[i])
    newObj.key = i
    newObj.line = _line++
    if (isObject(arr[i])) {
      newObj.value = parseObject(arr[i], _line)
      newObj.lastLine = _line++
      newObj.show = true
    } else if (isArray(arr[i])) {
      newObj.value = parseArray(arr[i], _line)
      newObj.lastLine = _line++
      newObj.show = true
    } else {
      if (arr[i] === null) {
        newObj.value = 'null'
      } else if (arr[i] === undefined) {
        newObj.value = 'undefined'
      } else {
        if (isString(arr[i])) {
          newObj.value = '"' + arr[i] + '"'
        } else {
          newObj.value = arr[i]
        }
      }
    }
    newData.push(newObj)
  }
  return newData
}

export default parseData
