import { inputCacheType } from '../input.type'
import { watch } from 'vue'
import getRealId from '../../form/fn/getRealId'

export default function (cache: inputCacheType, root: any, emit: any) {
  // 验证通过后会改写value
  watch(() => cache.valObj.value, () => {
    const id = cache.param?.__keyLv__
    const realId = getRealId(id!, cache.rowIndex!)

    if (cache.param?.createByForm) {
      root.proxy.changeFn(realId)
    } else {
      emit('change', cache.valObj.value)
    }

    if (cache.param?.changeFn) {
      cache.param?.changeFn(
        cache.valObj.value,
        root.proxy,
        root.proxy.getData())
    }
  }, { deep: true })
}
