import { formItemType } from '../../input/input.type'
import guid from './guid'
import { cloneDeep } from 'lodash'

export default function (serverData: any, formSetting: formItemType[], cache: any) {
  const data: any = cloneDeep(serverData)

  data.map((rs: any) => {
    rs.__guid__ = guid()
    return null
  })

  const createShowData = () => {
    const show: any = []
    cache.data.map((rs: any, i: number) => {
      const rowData: any = {}
      for (const [key, val] of Object.entries(rs)) {
        if (typeof val === 'object') {
          rowData[key] = (val as any).label
        } else {
          rowData[key] = val
        }
      }
      rowData.__index__ = i + 1
      show.push(rowData)
      return null
    })
    cache.show = show
  }

  cache.data = data
  createShowData()

  return createShowData
}
