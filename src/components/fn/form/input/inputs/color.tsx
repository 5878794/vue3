import { inputCacheType } from '../input.type'
import inputStyle from '../css/inputStyle.module.scss'
import { ElColorPicker } from 'element-plus'

export default function (cache: inputCacheType, checkFiled: () => boolean) {
  return (
    <ElColorPicker
      onChange={function () {
        checkFiled()
      }}
      v-model={cache.valObj.bindValue}
      class={[inputStyle.input]}
      disabled={cache.param?.disabled}
    />
  )
}
