import { formItemType, inputCacheType } from '../input.type'
import { cloneDeep } from 'lodash'

// 改变参数
export default function (cache: inputCacheType) {
  return function (opt: formItemType) {
    const newOpt = cloneDeep(opt)
    for (const [key, val] of Object.entries(newOpt)) {
      (cache.param as any)[key] = val
    }
  }
}
