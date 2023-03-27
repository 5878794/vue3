import { defineComponent } from 'vue'
import boxStyle from '../css/box.module.scss'

export default defineComponent({
  props: {
    src: {
      type: String, default: ''
    }
  },
  setup (props, { expose }) {
    let type = ''
    let newSrc = ''
    if (
      props.src?.indexOf('data:image/') === 0 ||
      props.src?.indexOf('http') === 0 ||
      props.src?.indexOf('https') === 0
    ) {
      type = 'img'
      // eslint-disable-next-line vue/no-setup-props-destructure
      newSrc = props.src
    } else if (props.src?.indexOf('#') === 0) {
      // svg 图标
      type = 'svg'
      newSrc = props.src.replace('#', '')
    }

    expose({})
    return { type, newSrc }
  },
  render () {
    if (this.type === 'img') {
      return <img src={this.src}/>
    } else if (this.type === 'svg') {
      return <span class={['iconfont', this.newSrc, boxStyle.box_hcc]}></span>
    } else {
      console.error(`icon:${this.src} 未识别！`)
      return null
    }
  }
})
