// 设置值

import {inputCacheType} from '../input.type'

export default function (cache: inputCacheType, showValChangeFn: any, dataChangeFn: any) {
  return function (val: any) {
    cache.valObj.value = val
    const newVal = dataChangeFn(val)
    cache.valObj.bindValue = newVal
    cache.valObj.showValue = showValChangeFn(newVal)
  }
}
