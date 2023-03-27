export default function (id: string, rowIndex: any[]) {
  for (let i = 0, l = rowIndex.length; i < l; i++) {
    id = id.replace('[row]', '[' + rowIndex[i] + ']')
  }
  return id
}
