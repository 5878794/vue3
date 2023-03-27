import { defineComponent } from 'vue'
import appStyle from './css/index.module.scss'
import boxStyle from './css/box.module.scss'

export default defineComponent({
  render () {
    return <>
      <div class={[boxStyle.box_slt, appStyle.fileInfo, 'fileInfo']}>fileInfo</div>
    </>
  }
})
