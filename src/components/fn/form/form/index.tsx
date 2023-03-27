import {
  defineComponent,
  ref,
  getCurrentInstance,
  provide,
  reactive,
  toRefs,
  watch,
  nextTick
} from 'vue'
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import handlerData from './fn/handlerData'
import {formItemType} from '../input/input.type'
import group from './group'
import myRule from '../input/fn/rule'
import reverseCheck from './fn/reverseCheck'
import formStyle from './css/formStyle.module.scss'

export default defineComponent({
  components: {group},
  props: {
    canMdf: {type: Boolean, default: true},
    labelWidth: {type: String, default: '120px'},
    serverData: {
      type: Object, default: () => ({})
    },
    formSetting: {
      type: Array, default: () => ([])
    },
    rule: {
      type: Object, default: () => ({})
    },
    uploadFn: {
      type: Function,
      default: () => {
        console.error('未配置上传函数')
        return ''
      }
    },
    showBigImageFn: {
      type: Function,
      default: () => {
        console.error('未配置查看大图的函数')
        return ''
      }
    }
  },
  emits: ['change'],
  setup(props, {expose, emit}) {
    const root = getCurrentInstance()
    provide('root', root)
    provide('fns', {
      uploadFn: props.uploadFn,
      showBigImageFn: props.uploadFn,
      rule: props.rule
    })

    // rule合并
    for (const [key, val] of Object.entries(props.rule)) {
      (myRule as any)[key] = val
    }

    const cache = reactive({
      data: [],
      submitData: {},
      ruleReverseCheck: {}
    })
    const handlerDataFn = () => {
      handlerData(
        props.formSetting as formItemType[],
        cache,
        props.serverData,
        props.uploadFn,
        props.showBigImageFn
      )
    }
    handlerDataFn()

    // formSetting 参数变化会重置表单
    watch(() => props.formSetting, () => {
      handlerDataFn()
    })
    watch(() => props.serverData, () => {
      handlerDataFn()
    })

    const main = ref(null)

    const getData = () => {
      return (main.value as any).getData()
    }
    const checkForm = () => {
      return (main.value as any).checkFiled()
    }
    const find = (key: string) => {
      return (main.value as any).find(key)
    }
    const checkAndGetData = () => {
      return (main.value as any).checkAndGetData()
    }

    const changeFn = (id: string) => {
      reverseCheck(id, cache.ruleReverseCheck, root)
      const data = getData()
      cache.submitData = data
      emit('change', {
        id: id,
        formData: data
      })
    }

    const refresh = () => {
      nextTick(() => {
        cache.submitData = getData()
      })
    }

    expose({getData, checkForm, find, checkAndGetData, changeFn, refresh})
    return {
      ...toRefs(cache),
      getData,
      checkForm,
      find,
      checkAndGetData,
      changeFn,
      refresh,
      main
    }
  },
  render() {
    return <ElConfigProvider locale={zhCn}>
      <group
        class={[formStyle.main]}
        ref='main'
        formSetting={this.data}
        serverData={this.serverData}
        labelWidth={this.labelWidth}
        canMdf={this.canMdf}
        submitData={this.submitData}
      />
    </ElConfigProvider>
  }
})
