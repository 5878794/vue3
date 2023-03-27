
<!--该文档用于在 storebook 中显示参数用， 无其他作用-->

<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  emits: ['resize'],
  props: {
    callBackInterval: { type: Number, default: 300 }, // 回调节流事件 ms
    setting: { type: Object, default: () => ({}), required: true }, // 配置参数 见上面setting注释
    defaultMinWidth: { type: Number, default: 50 }, // 默认最小宽高 单位px
    defaultMinHeight: { type: Number, default: 50 },
    scaleLineColor: { type: String, default: 'transparent' }, // 拖动条颜色
    scaleLineHoverColor: { type: String, default: 'rgba(0,0,0,.5)' },
    reactionWidth: { type: Number, default: 15 }, // 拖动条宽度
    createRandomBg: { type: Boolean, default: true } // 随机生成块的背景 初始辅助用
  }
})
</script>
