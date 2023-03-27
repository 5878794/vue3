import { inputCacheType } from '../input.type'
import inputStyle from '../css/inputStyle.module.scss'
import { ElTimePicker } from 'element-plus'

export default function (cache: inputCacheType, checkFiled: () => boolean) {
  const tag = ElTimePicker
  return (
    <tag
      onChange={function () {
        checkFiled()
      }}
      v-model={cache.valObj.bindValue}
      class={[inputStyle.input]}
      disabled={cache.param?.disabled}
      placeholder={cache.param?.placeholder}
    />
  )
}
