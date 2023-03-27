import { defineComponent } from 'vue'
import fileInfo from './fileInfo'
import inputs from './inputs'
import mainContainer from './mains'
import props from './props'

import appStyle from './css/index.module.scss'

export default defineComponent({
  components: {
    fileInfo, inputs, mainContainer, props
  },
  setup () {
    //
  },
  render () {
    return <>
      <div class={[appStyle.container, 'container']}>
        <fileInfo/>
        <mainContainer/>
        <props/>
        <inputs/>
      </div>
    </>
  }
})
