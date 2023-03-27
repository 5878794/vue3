/**
 creator:xf
 date:2022/11/3
 */

import {defineComponent, reactive, toRefs, inject, onMounted, getCurrentInstance} from 'vue'
import {inputCacheType} from './input.type'
import inputStyle from './css/inputStyle.module.scss'
// import 'element-plus/dist/index.css'
import {cloneDeep} from 'lodash'

import init from './fn/init'
import {ElFormItem} from 'element-plus'
import boxStyle from './css/box.module.scss'

import setParamFn from './fn/setParamFn'
import setValueFn from './fn/setValueFn'
import getDataFn from './fn/getDataFn'
import bindValueChangeFn from './fn/bindValueChange'
import getShowData from './fn/getShowData'
import createInputFn from './fn/createInput'
import createDivFn from './fn/createDiv'
import createUnitFn from './fn/createUnit'
import createCheckFiledFn from './fn/createCheckFiled'
import createChangeFn from './fn/createChangeFn'

export default defineComponent({
  props: {
    propData: {type: Object, default: () => ({})},
    serverData: {type: [String, Object, Array], default: ''},
    labelWidth: {type: String, default: '120px'},
    canMdf: {type: Boolean, default: true},
    createByForm: {type: Boolean, default: false},
    rowIndex: {type: Array, default: () => ([])}
  },
  emits: ['change'],
  setup(props, {emit, expose}) {
    const root = inject('root')
    const cache = reactive<inputCacheType>({
      rowIndex: props.rowIndex as number[],
      param: null,
      valObj: {
        // value: '',
        // oldValue: '',
        // showValue: ''
        bindValue: '', // 绑定的value date img==
        value: '', // 验证后的value （提交用）
        showValue: '' // 显示值转换用 （绑定的值自动转换） file
      }
    })

    // 数据格式转换函数
    const dataChangeFn = bindValueChangeFn(props.propData.type)
    // 显示数据格式转换
    const showValChangeFn = getShowData(props.propData.type)

    // 初始化
    const {initFn} = init(props, cache, dataChangeFn, showValChangeFn)
    initFn()

    // 创建数据变化触发函数
    createChangeFn(cache, root, emit)
    // 获取数据
    const getData = getDataFn(cache)
    // 创建验证函数
    const {checkFiled} = createCheckFiledFn(cache, root, getData)
    // 创建输入框函数
    const {createInput} = createInputFn(cache, checkFiled, root)
    // 创建非编辑状态时的div
    const {createDiv} = createDivFn(cache)
    // 创建单位
    const {createUnit} = createUnitFn(cache)
    // 刷新参数
    const setParam = setParamFn(cache)
    // 改变值
    const setValue = setValueFn(cache, showValChangeFn, dataChangeFn)
    // 获取所有参数
    const getParam = () => {
      return cloneDeep(cache.param)
    }

    onMounted(() => {
      if (cache.param?.setupFn) {
        const obj = getCurrentInstance()?.proxy
        cache.param?.setupFn(obj)
      }
    })

    expose({
      getData,
      checkFiled,
      setParam,
      setValue,
      getParam,
      label: cache.param?.label,
      unit: cache.param?.unit,
      type: cache.param?.type,
      options: cache.param?.options,
      unitOption: cache.param?.unitOption
    })
    return {
      getData,
      checkFiled,
      getParam,
      setParam,
      setValue,
      ...toRefs(cache),
      createDiv,
      createInput,
      createUnit
    }
  },
  render() {
    const labelWidth = (this.param?.type === 'button') ? 0 : this.param?.labelWidth
    const label = (this.param?.type === 'button') ? '' : this.param?.label
    const buttonClass = (this.param?.type === 'button') ? inputStyle.button : ''

    return <div
      class={['input_item', inputStyle.input_item]}
      style={this.param?.style}
    >
      <ElFormItem
        error={this.param?.errMsg}
        label-width={labelWidth}
        label={label}
        prop={this.param?.key}
        class={[boxStyle.box_hlc, buttonClass]}
      >
        {this.canMdf && this.createInput()}
        {this.canMdf && this.createUnit()}
        {!this.canMdf && this.createDiv()}
      </ElFormItem>
    </div>
  }
})
