import { inputCacheType, selectItemType } from '../input.type'

export default function (cache: inputCacheType) {
  const type = cache.param?.type
  switch (type) {
    case 'date':
    case 'time':
    case 'dateTime':
      return () => {
        return cache.valObj.bindValue.getTime()
      }
    case 'text': {
      const unitOption = cache.param?.unitOption
      if (unitOption && unitOption.length > 0) {
        // 带单位的输入框 转换数字为初始显示单位的值
        return () => {
          const outUnit = cache.param?.unit
          const showUnitVal = cache.param?.unitValObj?.value || '1'
          const outUnitVal = unitOption.find((item: selectItemType) => (item.label === outUnit))?.value ?? '0'
          return parseFloat(cache.valObj.bindValue) *
            parseFloat(showUnitVal) /
            parseFloat(outUnitVal)
        }
      } else {
        return () => {
          return cache.valObj.bindValue
        }
      }
    }
    case 'img': {
      return () => {
        const back: string[] = []
        cache.valObj.bindValue.map((item: any) => {
          back.push(item.response || item.url)
          return null
        })
        return back.join(',')
      }
    }
    default:
      return () => {
        return cache.valObj.bindValue
      }
  }
}
