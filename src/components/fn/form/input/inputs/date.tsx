import { inputCacheType } from '../input.type'
import inputStyle from '../css/inputStyle.module.scss'
import { ElDatePicker } from 'element-plus'

export default function (cache: inputCacheType, checkFiled: () => boolean) {
  const tag = ElDatePicker
  return (
    <tag
      onChange={function () {
        checkFiled()
      }}
      v-model={cache.valObj.bindValue}
      class={[inputStyle.input]}
      disabled={cache.param?.disabled}
      placeholder={cache.param?.placeholder}
      type='date'
    />
  )
}
