import { cloneDeep } from 'lodash'
import getRealId from './getRealId'

export default function (key: string, data: any, rowIndex: number[]) {
  let newData = cloneDeep(data)
  const realId = getRealId(key, rowIndex)
  const keyLv = realId.split(/\[|\]\.|\./ig)
  let back = ''
  for (let i = 0, l = keyLv.length; i < l; i++) {
    newData = newData[keyLv[i]] ?? ''
    if (newData === '') {
      back = ''
      break
    }
    if (i === l - 1) {
      back = newData
    }
  }

  return back
}
