import getKeyValue from './getKeyValue'

export default function (allServerData: any, json: any) {
  const allSubmitData: any = {}

  const fn = (nowJson: any[], serverData: any, rowIndex: number[], submitData: any) => {
    nowJson.map((item: any) => {
      const isTable = (item.type === 'table' || item.type === 'repeat')
      const isGroup = (item.type === 'group')

      const key = item.key
      let value = serverData[key] || item.value
      submitData[key] = value

      if (item.children && item.children.length > 0) {
        if (isGroup) {
          submitData[key] = {}
          const nextServerData = serverData[key] || {}
          fn(item.children, nextServerData, rowIndex, submitData[key])
        }

        if (isTable) {
          const repeatBy = item.repeatBy
          const repeat = parseInt(getKeyValue(repeatBy, allSubmitData, rowIndex)) || 0
          value = new Array(repeat).fill('')
          value = value.map(() => ({}))
          submitData[key] = value
          const nowServerData = serverData[key] || []
          for (let i = 0, l = repeat; i < l; i++) {
            const nextServerData = nowServerData[i] || {}
            const nextRowIndex = JSON.parse(JSON.stringify(rowIndex))
            nextRowIndex.push(i)
            fn(item.children, nextServerData, nextRowIndex, submitData[key][i])
          }
        }
      }

      return null
    })
  }

  fn(json, allServerData, [], allSubmitData)

  return allSubmitData
}
