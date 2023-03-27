/**
* @author liuchuan
* @description 
 */

import { defineComponent } from 'vue'

export default defineComponent({
  name: '',
  components: {},
  props: {
    tools: {
      type: Array,
      default: () => ['dir', 'add', 'remove']
    }
  },
  setup (props) {
    return () => <>
    <div class={['toolbar_container']}>
      工具条123
    </div>
    </>
  },
})
