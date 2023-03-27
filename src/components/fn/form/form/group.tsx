import { defineComponent, getCurrentInstance, inject } from 'vue'
import myInput from '../input/index'
import getKeyValue from './fn/getKeyValue'
import formStyle from './css/formStyle.module.scss'
import { formItemType } from '../input/input.type'
import repeatDom from './repeat'
import addListDom from './addList'
import checkRenderChange from './fn/checkRenderChange'
import boxStyle from '../input/css/box.module.scss'

export default defineComponent({
  name: 'bFrom',
  components: { myInput },
  props: {
    canMdf: { type: Boolean, default: true },
    labelWidth: { type: String, default: '120px' },
    serverData: {
      type: Object, default: () => ({})
    },
    formSetting: {
      type: Array, default: () => ([])
    },
    id: { type: String, default: '' },
    submitData: { type: Object, default: () => ({}) },
    rowIndex: { type: Array, default: () => ([]) }
  },
  setup (props, { expose }) {
    const root = inject('root')
    const showItems = new Map()
    const _this = getCurrentInstance()

    const getData = () => {
      const back: any = {}
      showItems.forEach((value, key) => {
        const domRef = _this!.proxy?.$refs[value] as any
        if (domRef && domRef.type !== 'button') {
          back[key] = (domRef && domRef.getData) ? domRef.getData() : ''
        }
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

    checkRenderChange(showItems, root)

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

    const createItem = (item: any, serverData: any) => {
      if (item.when) {
        const temp = item.when.split('=')
        const whenKey = temp[0] // id是可能带.的有层级
        const whenVal = temp[1]
        const nowData = getKeyValue(whenKey, this.submitData, this.rowIndex as number[]) || ''
        if (nowData.toString() !== whenVal) {
          return null
        }
      }

      const type = item.type
      this.showItems.set(item.key, item.__id__)
      switch (type) {
        case 'text':
        case 'color':
        case 'date':
        case 'dateTime':
        case 'time':
        case 'radio':
        case 'password':
        case 'file':
        case 'img':
        case 'button':
        case 'select': {
          const data = serverData[item.key]
          return <my-input
            ref={item.__id__}
            key={item.__id__}
            id={item.__id__}
            style={item.style}
            canMdf={this.canMdf}
            labelWidth={this.labelWidth}
            propData={item}
            serverData={data}
            createByForm={true}
            data-key-lv={item.__keyLv__}
            rowIndex={this.rowIndex}
          />
        }
        case 'group': {
          const key = item.key
          const data = (key) ? serverData[key] : serverData
          return <div
            style={item.style}
            id={item.__id__}
            data-key-lv={item.__keyLv__}
            class={['__group__']}
          >
            {item.label && <p>{item.label}</p>}
            {/* 没有key的时候下面的子集当成平级元素渲染 */}
            {!key && item.children && createList(item.children, data)}
            {/* 有key的时候当成另一个form渲染 */}
            {key && item.children && createGroup(item, data)}
          </div>
        }
        case 'repeat': {
          const key = item.key
          const data = serverData[key] || []
          const tag = repeatDom
          if (item.repeatBy) {
            return <div
              style={item.style}
              id={item.__id__}
              data-key-lv={item.__keyLv__}
            >
              <tag
                id={item.__id__}
                ref={item.__id__}
                key={item.__id__}
                formSetting={item.children}
                serverData={data}
                labelWidth={this.labelWidth}
                canMdf={this.canMdf}
                repeatBy={item.repeatBy}
                submitData={this.submitData}
                rowIndex={this.rowIndex}
              />
            </div>
          } else {
            console.error('repeat 组件未设置 repeatBy 属性')
            return null
          }
        }
        case 'addList': {
          const key = item.key
          const data = serverData[key] || []
          const tag = addListDom
          return <div
            style={item.style}
            id={item.__id__}
            data-key-lv={item.__keyLv__}
          >
            <tag
              id={item.__id__}
              ref={item.__id__}
              key={item.__id__}
              formSetting={item.inputs}
              serverData={data}
              labelWidth={this.labelWidth}
              canMdf={this.canMdf}
              submitData={this.submitData}
              rowIndex={this.rowIndex}
              pagination={item.pagination}
              pageSize={item.pageSize}
              height={item.height}
            />
          </div>
        }
        default:
          console.error(type + ' 不存在！')
          return null
      }
    }

    const createGroup = (item: formItemType, data: any) => {
      return <b-from
        ref={item.__id__}
        key={item.__id__}
        formSetting={item.children}
        serverData={data}
        labelWidth={this.labelWidth}
        canMdf={this.canMdf}
        submitData={this.submitData}
        rowIndex={this.rowIndex}
      />
    }

    const createList = (settings: any, serverData: any) => {
      serverData = serverData || {}
      return settings.map((item: any) => {
        return createItem(item, serverData)
      })
    }

    return <div class={[formStyle.form_item, boxStyle.box_hlc, boxStyle.box_lines, '__form__']}>
      {createList(this.formSetting, this.serverData)}
    </div>
  }
})
