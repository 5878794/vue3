import { checkResultType, formDataType } from '../input.type'
import myRule from './rule'
import getKeyValue from '../../form/fn/getKeyValue'
import getKeyLabel from '../../form/fn/getKeyLabel'

export default function (rule: string, val: any, formData: formDataType, formObj: any, rowIndex: number[]): checkResultType {
  if (!rule) {
    return { pass: true, msg: '' }
  }
  const rules = rule ? rule.split(',') : []
  let pass = true
  let msg = ''
  rules.map((item) => {
    // 解析规则 获取规则名和规则值
    let nowRule = item
    let ruleVal = ''
    let label = ''

    if (nowRule.indexOf(':') > -1) {
      const temp = nowRule.split(':')
      nowRule = temp[0]
      ruleVal = temp[1]
      if (!isNaN(ruleVal as any)) {
        // 是数字
      } else {
        // 是key
        label = getKeyLabel(ruleVal, formObj, rowIndex)
        ruleVal = getKeyValue(ruleVal, formData, rowIndex)
      }
    }

    if ((myRule as any)[nowRule]) {
      const rs = (myRule as any)[nowRule](val, ruleVal, label)
      if (!rs.pass) {
        pass = false
        msg = rs.msg
      }
    }
    return null
  })

  return {
    pass,
    msg
  }
}
