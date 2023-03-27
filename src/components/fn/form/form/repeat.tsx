import { defineComponent, getCurrentInstance } from 'vue'
import group from './group'
import getKeyValue from './fn/getKeyValue'
import formStyle from './css/formStyle.module.scss'
import { formItemType } from '../input/input.type'

export default defineComponent({
  components: { group },
  props: {
    canMdf: { type: Boolean, default: true },
    labelWidth: { type: String, default: '120px' },
    serverData: {
      type: Array, default: () => ([])
    },
    formSetting: {
      type: Array, default: () => ([])
    },
    id: { type: String, default: '' },
    submitData: { type: Object, default: () => ({}) },
    repeatBy: { type: String, default: '' },
    rowIndex: { type: Array, default: () => ([]) }
  },
  setup (props, { expose }) {
    const showItems = new Map()
    const _this = getCurrentInstance()

    const getData = () => {
      const back: any = []
      showItems.forEach((value, key) => {
        const domRef = _this!.proxy?.$refs[value] as any
        const data = (domRef && domRef.getData) ? domRef.getData() : ''
        back.push(data)
      })
      return back
    }

    const checkFiled = () => {
      let pass = true
      showItems.forEach((value, key) => {
        const domRef = _this!.proxy?.$refs[value] as any
        if (domRef.checkFiled && !domRef.checkFiled()) {
          pass = false
        }
      })

      return pass
    }

    const find = (key: string) => {
      const refValue = showItems.get(key)
      const domRef = _this!.proxy?.$refs[refValue] as any
      return domRef
    }

    const checkAndGetData = () => {
      const pass = checkFiled()
      const data = getData()

      return {
        pass: pass,
        data: data

      }
    }

    expose({ getData, checkFiled, find, checkAndGetData })
    return {
      getData,
      checkFiled,
      find,
      checkAndGetData,
      showItems
    }
  },
  render () {
    this.showItems.clear()

    const createGroup = (children: formItemType[], data: any, id: string, i: number[], showItemKey: string) => {
      const tag = group
      this.showItems.set(showItemKey, id)
      return <tag
        id={id}
        ref={id}
        key={id}
        formSetting={children}
        serverData={data}
        labelWidth={this.labelWidth}
        canMdf={this.canMdf}
        submitData={this.submitData}
        rowIndex={i}
      />
    }

    const repeatNumber = parseInt(getKeyValue(this.repeatBy, this.submitData, this.rowIndex as number[])) || 0
    return <div class={[formStyle.form_item, '__repeat__']}>
      {new Array(repeatNumber).fill('').map((item, i) => {
        const thisRowIndex = JSON.parse(JSON.stringify(this.rowIndex))
        thisRowIndex.push(i)
        return createGroup(
          this.formSetting as formItemType[],
          this.serverData[i],
          this.id + '_' + i,
          thisRowIndex,
          '[' + i + ']' // 用于find的查找
        )
      })}
    </div>
  }
})
