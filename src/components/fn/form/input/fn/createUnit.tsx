import { ElSelect, ElOption } from 'element-plus'
import { selectItemType, inputCacheType } from '../input.type'
import inputStyle from '../css/inputStyle.module.scss'
import boxStyle from '../css/box.module.scss'

export default function (cache: inputCacheType) {
  const createUnit = () => {
    const showUnit = cache.param?.unit || ''
    const dist = cache.param?.unitOption || []

    if (!showUnit) {
      return null
    }

    if (dist.length === 0) {
      return createUnitText()
    }

    return createUnitSelect()
  }

  const createUnitText = () => {
    return <div class={['unitText', boxStyle.box_hcc, inputStyle.textUnit]}>{cache.param?.unit}</div>
  }

  const createUnitSelect = () => {
    return <ElSelect
      size="default"
      class={[inputStyle.selectUnit, 'selectUnit']}
      v-model={cache.param!.unitValObj!.value}
      multiple={false}
      onChange={function () {
        unitChange()
      }}
    >
      {createUnitOption()}
    </ElSelect>
  }

  const unitChange = () => {
    const change = (typeof cache.param?.unitAutoChangeVal === 'boolean') ? cache.param?.unitAutoChangeVal : true
    if (!change) {
      return
    }
    const val = cache.valObj.bindValue
    const unitValObj = cache.param!.unitValObj!
    if (val && !isNaN(val)) {
      cache.valObj.bindValue =
        (parseFloat(val) *
          parseFloat(unitValObj.oldValue) /
          parseFloat(unitValObj.value)
        ).toString()
    }
    unitValObj.oldValue = unitValObj.value
  }

  const createUnitOption = () => {
    return <>
      {
        cache.param?.unitOption?.map((rs: selectItemType) => {
          return <ElOption
            label={rs.label}
            value={rs.value}
            key={rs.value}/>
        })
      }
    </>
  }

  return { createUnit }
}
