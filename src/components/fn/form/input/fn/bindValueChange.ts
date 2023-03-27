// 日期转换
const dateChange = (val: any) => {
  if (!(val instanceof Date)) {
    if (!isNaN(val)) {
      return new Date(parseInt(val))
    } else {
      return new Date(val)
    }
  } else {
    return val
  }
}

// 处理传入数据的格式
export default function (type: string) {
  switch (type) {
    case 'date':
      return (val: any) => {
        if (!val) {
          return val
        }
        const date = dateChange(val)
        return new Date(date.setHours(0, 0, 0, 0))
      }
    case 'dateTime':
    case 'time':
      return (val: any) => {
        if (!val) {
          return val
        }
        const date = dateChange(val)
        return new Date(date.setMilliseconds(0))
      }
    case 'img':
      return (val: any) => {
        const temp = val ? val.split(',') : []
        const back: any = []
        temp.map((item: any) => {
          item = decodeURIComponent(item)
          back.push({
            name: item.substring(item.lastIndexOf('/') + 1),
            url: item
          })
          return ''
        })
        return back
      }
    default:
      return (val: any) => {
        return val
      }
  }
}
