
// 处理数据和显示内容不一致的问题

export default function (type:string) {
  switch (type) {
    case 'file':
      return (val: any) => {
        let fileName = decodeURIComponent(val)
        // 取后缀名
        const ext = fileName.substring(fileName.lastIndexOf('.'))
        // 去掉服务器添加的随机字符串
        const fileNames = fileName.split('_')
        fileNames.splice(fileNames.length - 1)
        fileName = fileNames.join('_') + ext
        // 取文件名
        return fileName.substring(fileName.lastIndexOf('/') + 1)
      }
    default:
      return (val: any) => {
        return val
      }
  }
}
