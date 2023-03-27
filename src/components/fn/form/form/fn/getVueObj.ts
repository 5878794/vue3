export default function (realKey: string, formObj: any) {
  realKey = realKey.replace(/\[/ig, '.[')
  const keyLv = realKey.split('.')

  let obj = formObj.proxy
  for (let i = 0, l = keyLv.length; i < l; i++) {
    if (obj && obj.find) {
      const thisKey = keyLv[i]
      obj = obj.find(thisKey)
    } else {
      obj = null
      break
    }
  }
  return obj
}
