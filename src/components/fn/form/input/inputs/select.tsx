import { inputCacheType } from '../input.type'
import inputStyle from '../css/inputStyle.module.scss'
import { ElSelect, ElOption } from 'element-plus'

export default function (cache: inputCacheType, checkFiled: () => boolean) {
  const createOption = () => {
    return cache.param?.options?.map((opt) => {
      return <ElOption
        label={opt.label}
        value={opt.value}
        key={opt.value}
      />
    })
  }

  return <>
    <ElSelect
      onChange={function () {
        checkFiled()
      }}
      v-model={cache.valObj.bindValue}
      multiple={false}
      size="default"
      class={[inputStyle.input]}
      disabled={cache.param?.disabled}
      placeholder={cache.param?.placeholder}
    >
      {
        createOption()
      }
    </ElSelect>
  </>
}
