const isArray = (item) => {
  if (item === 'array') {
    return true;
  }
  return Object.prototype.toString.call(item) === '[object Array]';
};

const isObject = (item) => {
  return Object.prototype.toString.call(item) === '[object Object]';
};

const needFormat = (type) => {
  return type === 'array' || type === 'object';
};

const getIndent = (level) => {
  if (level === 1) {
    return { textIndent: '20px' };
  }
  return { textIndent: `${level * 20}px` };
};

const getType = (item) => {
  let t = Object.prototype.toString.call(item);
  let match = /(?!\[).+(?=\])/g;
  t = t.match(match)[0].split(' ')[1];
  return t.toLowerCase();
};

const isComplexType = (param) => {
  return isObject(param) || isArray(param);
};

const isTheSametype = (a, b) => {
  return (
      Object.prototype.toString.call(a) === Object.prototype.toString.call(b)
  );
};

let sort = false;
const mergeData = (_old, _new,_sort) => {
  // the checking to be sensitive for the index of the array or not
  sort = _sort
  // finally result
  let result = [];
  // each line No.
  let start = 1;

  // convert array or object to Array<object> [{}]
  const convertObject = (param, lineType) => {
    let list = [];
    if (isComplexType(param)) {
      let showIndex = getType(param) === 'object';
      let keys = Object.keys(param);
      let length = keys.length;
      keys.forEach((key, index) => {
        let type = getType(param[key]);
        list.push({
          name: key,
          line: start++,
          value: convertObject(param[key], lineType),
          type: type,
          showIndex: showIndex,
          needComma: length !== index + 1,
          lineType: lineType,
          lastLineType: lineType,
          lastLine: isComplexType(param[key]) ? start++ : null,
        });
      });
      return list;
    } else {
      switch (getType(param)) {
        case 'number':
        case 'boolean':
        case 'regexp':
          return param.toString();
        case 'null':
          return 'null';
        case 'undefined':
          return 'undefined';
        case 'function':
          return ' ƒ() {...}';
        default:
          return `"${param.toString()}"`;
      }
    }
  };

  // return parsed data
  const parseValue = (key, value, showIndex, needComma, lineType) => {
    return {
      name: key,
      line: start++,
      value: convertObject(value, lineType),
      type: getType(value),
      showIndex: showIndex,
      needComma: needComma,
      lineType: lineType,
      lastLineType: lineType,
      lastLine: isComplexType(value) ? start++ : null,
    };
  };

  // return an array with repeated values
  const getRepeatedValues = (a, b) =>{
    let RepeatedValues = []
    for (const akey in a) {
      if (Object.hasOwnProperty.call(a, akey)) {
        let A_eleValue = a[akey];
        for (const bkey in b) {
          if (Object.hasOwnProperty.call(b, bkey)) {
            let B_eleValue = b[bkey];
            if (A_eleValue === B_eleValue) {
              RepeatedValues.push(A_eleValue)
            }
          }
        }
      }
    }
    return RepeatedValues
  }

  // return the repeated value in the ild or in hte new object and the status of this value if "del" or "add"
  const getIsRepeatedValue = (A_Object,B_Object,A_Value,B_Value,RepeatedValues)=>{
    let objContainer = {}
    if (RepeatedValues.includes(A_Value)) {
      objContainer.RepeatedObj = A_Object
      objContainer.notRepeated = B_Object
      objContainer.actionR = 'none'
      objContainer.actionNR = !RepeatedValues.includes(B_Value) ? 'add' : null
    }else{
      objContainer.RepeatedObj = B_Object
      objContainer.notRepeated = A_Object
      objContainer.actionR = 'add'
      objContainer.actionNR = !RepeatedValues.includes(A_Value) ? 'del' : null
    }
    return objContainer;
  }

  // merge two vars to target,target type Array<object>[{}]
  const parseData = (a, b, target) => {
    let _ar = Object.keys(a);
    let _br = Object.keys(b);
    let showIndex = isObject(b);
    // deleted keys
    let _del = _ar.filter((ak) => !_br.some((bk) => bk === ak));
    // not removed keys
    let _stl = _ar.filter((ak) => _br.some((bk) => bk === ak));
    // new added keys
    let _add = _br.filter((bk) => !_ar.some((ak) => ak === bk));
    // getting the repeated values
    let RepeatedValues = getRepeatedValues(a, b)

    // The core function: compare
    _stl.forEach((key, index) => {
      let needComma = true;
      if (_add.length === 0 && index === _stl.length - 1) {
        needComma = false;
      }
      if (a[key] === b[key]) {
        // values haven't changed
        target.push(parseValue(key, b[key], showIndex, needComma, 'none'));
      } else if (isTheSametype(a[key], b[key])) {
        if (isComplexType(b[key])) {
          let _target = parseValue(
              key,
              isArray(a[key]) ? [] : {},
              showIndex,
              needComma,
              'none'
          );
          target.push(_target);
          // back one step
          start -= 1;
          // go inside
          parseData(a[key], b[key], _target.value);
          // rewrite lastline
          _target.lastLine = start++;
        } else {
          if (sort && RepeatedValues.length > 0) {
            let isRepeatedValue = getIsRepeatedValue(a,b,a[key],b[key],RepeatedValues)
            target.push(parseValue(key, isRepeatedValue.RepeatedObj[key], showIndex, needComma, isRepeatedValue.actionR));
            if(isRepeatedValue.actionNR)
              target.push(parseValue(key, isRepeatedValue.notRepeated[key], showIndex, needComma, isRepeatedValue.actionNR));
          }else{
            target.push(parseValue(key, a[key], showIndex, true, 'del'));
            target.push(parseValue(key, b[key], showIndex, needComma, 'add'));
          }
        }
      } else {
        target.push(parseValue(key, a[key], showIndex, true, 'del'));
        target.push(parseValue(key, b[key], showIndex, needComma, 'add'));
      }
    });
    // push deleted keys
    _del.forEach((key, index) => {
      let needComma = true;
      if (_stl.length === 0 && _add.length === 0 && index === _del.length - 1) {
        needComma = false;
      }
      target.push(parseValue(key, a[key], showIndex, needComma, 'del'));
    });
    // push new keys
    _add.forEach((key, index) => {
      target.push(
          parseValue(key, b[key], showIndex, _add.length !== index + 1, 'add')
      );
    });
  };

  if (isTheSametype(_old, _new) && isComplexType(_new)) {
    parseData(_old, _new, result);
  } else {
    if (_old === _new) {
      result.push(parseValue(0, _new, false, false, 'none'));
    } else {
      result.push(parseValue(0, _old, false, true, 'del'));
      result.push(parseValue(1, _new, false, false, 'add'));
    }
  }
  return result;
};

export {
  isArray,
  isObject,
  needFormat,
  getIndent,
  getType,
  isComplexType,
  isTheSametype,
  mergeData,
};
