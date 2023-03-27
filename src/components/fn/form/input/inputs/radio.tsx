import { inputCacheType } from '../input.type'
import { ElRadio, ElRadioGroup } from 'element-plus'

export default function (cache: inputCacheType, checkFiled: () => boolean) {
  const createInput = () => {
    return (
      <ElRadioGroup
        v-model={cache.valObj.bindValue}
        disabled={cache.param?.disabled}
        onChange={function () {
          checkFiled()
        }}>
        {
          cache.param?.options?.map((item) => {
            return <ElRadio
              label={item.value}
            >{item.label}</ElRadio>
          })
        }
      </ElRadioGroup>

    )
  }

  return <>
    {createInput()}
  </>
}
