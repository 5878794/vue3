import {defineComponent} from 'vue'

import appStyle from './css/index.module.scss'
import boxStyle from './css/box.module.scss'
import bIcon from './publishCom/icon'
import {inputs} from './setting'
import {dragObjType} from './types'
import {dragInputType} from './cache'

export default defineComponent({
  setup(props, {expose}) {
    const dragstartFn = (rs: dragObjType, e: DragEvent) => {
      e.dataTransfer!.setData('type', rs.type)
      dragInputType.value = rs.type
    }
    const dragEndFn = () => {
      dragInputType.value = ''
    }

    expose({})
    return {
      dragstartFn, dragEndFn
    }
  },
  render() {
    const renderInputs = () => {
      return inputs.map((rs: any) => {
        const tag = bIcon
        return <>
          <tag
            onDragstart={(e: DragEvent) => {
              this.dragstartFn(rs, e)
            }}
            onDragend={this.dragEndFn}
            draggable="true"
            title={rs.desc}
            src={rs.icon}
          ></tag>
        </>
      })
    }

    return <>
      <div class={[appStyle.inputs, boxStyle.box_hcc, 'inputs']}>
        {renderInputs()}
      </div>
    </>
  }
})
