// 反向验证
import getRealId from './getRealId'
import getVueObj from './getVueObj'

export default function (key: string, ruleReverseCheck: any, formObj: any) {
  const thisRowIndex = key.match(/(?<=\[)\d+(?=\])/ig) || []
  const initKey = key.replace(/\[\d+\]/ig, '[row]')
  const targetKey = ruleReverseCheck[initKey]
  if (targetKey) {
    const realTargetKey = getRealId(targetKey, thisRowIndex)
    const obj = getVueObj(realTargetKey, formObj)
    if (obj) {
      obj.checkFiled()
    }
  }
}
