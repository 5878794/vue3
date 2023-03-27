import { onMounted, onUpdated } from 'vue'

// 检查渲染列表是否变化
export default function (showItems: Map<string, string>, root: any) {
  let oldShowItems: string[] = []
  onMounted(() => {
    oldShowItems = [...showItems.values()].sort();
    (root as any).proxy.refresh()
  })
  onUpdated(() => {
    const nowItems = [...showItems.values()].sort()

    if (nowItems.length !== oldShowItems.length) {
      (root as any).proxy.refresh()
    } else {
      // 深度匹配是否相等
      let change = false
      nowItems.map((rs: string, i: number) => {
        if (rs !== oldShowItems[i]) {
          change = true
        }
        return null
      })
      if (change) {
        (root as any).proxy.refresh()
      }
    }
    oldShowItems = nowItems
  })
}
