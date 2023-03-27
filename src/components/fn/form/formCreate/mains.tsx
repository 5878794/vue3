// @ts-nocheck
import {defineComponent, watch, ref} from 'vue'
import appStyle from './css/index.module.scss'
import boxStyle from './css/box.module.scss'
import {dragInputType} from './cache'

export default defineComponent({
  setup() {
    const showDiv = document.createElement('div')
    showDiv.style.cssText = 'background:red;width:500px;height:200px;'

    const pointerClass = ref('')
    watch(dragInputType, () => {
      if (dragInputType.value) {
        // 开始拖咯
        pointerClass.value = appStyle.main_pointer_none
      } else {
        // 已释放
        pointerClass.value = ''
      }
    })

    const dragEnterFn = (e: DragEvent) => {
      console.log('in', (e.target as any).className)
      const dom = e.target as HTMLElement
      dom.appendChild(showDiv)
    }
    const dragLevelFn = (e: DragEvent) => {
      console.log('out', (e.target as any).className)
      // const dom = e.target as HTMLElement
      // dom.removeChild(showDiv)
      // console.log('out')
      // console.log(e)
    }
    const dropFn = (e: DragEvent) => {
      const type = e.dataTransfer!.getData('type')

      console.log('end', type)
    }

    const dragOverFn = (e: DragEvent) => {
      e.preventDefault()
    }

    return {
      dragEnterFn,
      dropFn,
      dragOverFn,
      dragLevelFn,
      pointerClass
    }
  },
  render() {
    return <>
      <div
        onDragleave={this.dragLevelFn}
        onDragenter={this.dragEnterFn}
        onDrop={this.dropFn}
        onDragover={this.dragOverFn}
        class={[boxStyle.box_hlt, appStyle.main, this.pointerClass, 'main']}
      >
        <span
        >main</span>
      </div>
    </>
  }
})
