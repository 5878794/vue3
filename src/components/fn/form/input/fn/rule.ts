export default {
  required (val: any) {
    return {
      pass: !!val.toString(),
      msg: '请输入！'
    }
  },
  number (val: any) {
    return {
      pass: !isNaN(val),
      msg: '请输入数字'
    }
  },
  min (val: any, ruleVal: string, label?: string) {
    if (!ruleVal) {
      return { pass: true, msg: '' }
    }
    return {
      pass: parseFloat(val.toString()) <= parseFloat(ruleVal),
      msg: `必须小于等于${label || ruleVal}`
    }
  },
  max (val: any, ruleVal: string, label?: string) {
    if (!ruleVal) {
      return { pass: true, msg: '' }
    }
    return {
      pass: parseFloat(val.toString()) >= parseFloat(ruleVal),
      msg: `必须大于等于${label || ruleVal}`
    }
  }
}
