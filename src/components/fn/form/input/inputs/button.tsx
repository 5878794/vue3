import { inputCacheType } from '../input.type'
import inputStyle from '../css/inputStyle.module.scss'
import { ElButton } from 'element-plus'
import * as icons from '@element-plus/icons-vue'

export default function (cache: inputCacheType, checkFiled: () => boolean, root: any) {
  const clickFn = () => {
    const fn = cache.param?.clickFn || function () {
      //
    }
    fn(root.proxy, root.proxy.getData())
  }

  // const tag = ElButton
  const icon = cache.param?.buttonIcon ? (icons as any)[cache.param?.buttonIcon] : ''
  return (
    <ElButton
      v-model={cache.valObj.bindValue}
      class={[inputStyle.input]}
      disabled={cache.param?.disabled}
      icon={icon}
      type={cache.param?.buttonType as any ?? 'primary'}
      onClick={clickFn}
    >{cache.param?.label}</ElButton>
  )
}
