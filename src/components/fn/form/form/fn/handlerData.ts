import { formItemType } from '../../input/input.type'
import guid from './guid'
import { cloneDeep } from 'lodash'
import getInitSubmitData from './getInitSubmitData'
import ruleReverseCheck from './getRuleReverseCheckData'

// 遍历数据添加guid
const handlerData = (setting: formItemType[], cache: any, serverData: any, uploadFn: any, showBigImageFn: any) => {
  const data = cloneDeep(setting)
  const newServerData = cloneDeep(serverData)
  const ruleReverseCheckData = {}

  const fn = (settings: formItemType[], parentKey: string[]) => {
    // eslint-disable-next-line array-callback-return
    settings.map((item: formItemType) => {
      const thisKeyLv = cloneDeep(parentKey)
      item.__id__ = guid()
      if (item.key) {
        thisKeyLv.push(item.key)
        item.__keyLv__ = thisKeyLv.join('.')

        if (item.type === 'repeat' || item.type === 'table') {
          const last = thisKeyLv.length - 1
          if (last >= 0) {
            const lastItem = thisKeyLv[last]
            thisKeyLv[last] = lastItem + '[row]'
          }
        }
      }

      ruleReverseCheck(item, ruleReverseCheckData)

      // 未配置的，应用全局uploadFn
      if (item.type === 'file' || item.type === 'img') {
        item.uploadFn = item.uploadFn || uploadFn
      }
      if (item.type === 'img') {
        item.showBigImageFn = item.showBigImageFn || showBigImageFn
      }

      if (item.children && item.children.length > 0) {
        fn(item.children, thisKeyLv)
      }
    })
  }
  fn(data, [])

  cache.submitData = getInitSubmitData(newServerData, data)
  cache.data = data
  cache.ruleReverseCheck = ruleReverseCheckData
}

export default handlerData
