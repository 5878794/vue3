import { formItemType } from '../../input/input.type'

export default function (item: formItemType, data: any) {
  if (!item.rule) {
    return
  }

  const rules = item.rule.split(',')
  rules.map((rule: string) => {
    if (rule.indexOf(':') > -1) {
      const temp = rule.split(':')
      const key = temp[1]
      data[key] = item.__keyLv__
    }
    return null
  })
}
