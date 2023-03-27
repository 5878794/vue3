import { cloneDeep } from 'lodash'
import { inputCacheType, selectItemType } from '../input.type'
import { watch } from 'vue'

export default function (props: any, cache: inputCacheType, dataChangeFn:any, showValChangeFn:any) {
  // 单位对象的处理  并添加到prop中
  const createUnitObj = () => {
    if (props.propData.unit && props.propData.unitOption && props.propData.unitOption.length > 0) {
      const dist = props.propData.unitOption
      const showUnit = props.propData.unit
      const showUnitVal = dist.find((item: selectItemType) => (item.label === showUnit))?.value ?? '0'
      if (cache.param) {
        cache.param.unitValObj = {
          value: showUnitVal,
          oldValue: showUnitVal
        }
      }
    }
  }

  watch(() => cache.valObj.bindValue, () => {
    cache.valObj.showValue = showValChangeFn(cache.valObj.bindValue)
  })

  const handlerStamp = () => {
    // 处理时间戳
    const type = cache.param?.type
    if (type === 'date' || type === 'time' || type === 'dateTime') {
      cache.valObj.value = cache.valObj.bindValue.getTime()
    }
  }

  // 对传入的服务器数据覆盖现有值
  const createValObj = () => {
    cache.valObj.value = props.serverData ? props.serverData : cache.param?.value
    cache.valObj.bindValue = props.serverData ? dataChangeFn(props.serverData) : dataChangeFn(cache.param?.value)

    handlerStamp()
  }
  const changeValObj = () => {
    cache.valObj.value = props.serverData ? props.serverData : cache.valObj.value
    cache.valObj.bindValue = props.serverData ? dataChangeFn(props.serverData) : dataChangeFn(cache.valObj.value)

    handlerStamp()
  }

  const handlerPropObj = () => {
    // 克隆传入的数据
    const thisPropData = cloneDeep(props.propData)
    // 将传入的数据合并到现有的缓存中
    cache.param = Object.assign(cache.param || {}, thisPropData)
    // 对未传入labelWidth的取用公共的设置
    if (cache.param) {
      cache.param.labelWidth = cache.param?.labelWidth || props.labelWidth
      cache.param.isUploading = false
      cache.param.disabled = (typeof cache.param?.disabled === 'boolean') ? cache.param?.disabled : false
      cache.param.createByForm = props.createByForm
    }
  }

  const initFn = () => {
    handlerPropObj()
    createUnitObj()
    createValObj()
  }

  watch(() => props.serverData, () => {
    changeValObj()
  })

  return { initFn }
}
