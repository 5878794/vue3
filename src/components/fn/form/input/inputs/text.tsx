import { inputCacheType } from '../input.type'
import inputStyle from '../css/inputStyle.module.scss'
import { ElInput } from 'element-plus'

export default function (cache: inputCacheType, checkFiled: () => boolean) {
  return (
    <ElInput
      onBlur={function () {
        checkFiled()
      }}
      v-model={cache.valObj.bindValue}
      class={[inputStyle.input]}
      disabled={cache.param?.disabled}
      placeholder={cache.param?.placeholder}
    />
  )
}
