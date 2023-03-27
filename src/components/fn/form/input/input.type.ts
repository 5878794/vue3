
export interface selectItemType {
  label: string,
  value: string
}

export interface checkResultType {
  pass: boolean,
  msg: string
}

export interface uploadRsType {
  name: string
}

export interface inputValueObjType {
  value: any,
  bindValue?: any
  showValue?: any
}

export interface unitValueObjType {
  value: string,
  oldValue: string
}

export interface formDataType {
  [key: string]: any
}

export interface formItemType {
  __id__?: string,
  __keyLv__?: string, // key的层级 中间用.分隔
  children?: formItemType[],
  type: 'text' | 'password' | 'select' | 'radio' | 'checkbox' | 'color' |
    'button' | 'date' | 'time' | 'dateTime' | 'file' | 'img' | 'password' |
    'repeat' | 'table' | 'customCom' | 'group',
  key: string, // key   不一定唯一 有repeat或层级
  label?: string, // 标签
  labelWidth?: string, // 标签宽度  default:120px
  canMdf?: boolean, // 是否编辑模式 default:true
  disabled?: boolean, // 是否可输入 default:false
  placeholder?: string,
  value?: any, // 初始值
  rule?: string, // 简单的验证规则
  unit?: string, // 显示单位
  unitOption?: selectItemType[], // 单位下拉选择
  unitAutoChangeVal?: boolean, // 单位下拉是否自动转换值
  options?: selectItemType[], // select、radio、checkbox  的选项
  repeatBy?: string, // 循环组件的循环值依赖于的key
  style?: string, // 样式
  errMsg?: string, // 验证错误信息
  limit?: string, // 图片上传的最大数量
  when?: string, // 是否显示控件 eg   when:'a=1'
  createByForm?: boolean, // 是否是由form组件创建
  unitValObj?: unitValueObjType, // 内部使用 当前单位的值
  isUploading?: boolean, // 内部使用  文件是否上传中
  buttonIcon?: string, // button的图标 @element-plus/icons-vue 中的名字
  buttonType?: string, // button的类型
  pagination?: boolean, // addList 是否分页
  pageSize?: number, // addList 分页数 默认10
  height?: number, // addList的高度

  ruleFn?: (value: any, formData: formDataType) => checkResultType, // 验证函数
  setupFn?: (obj: any) => void, // 初始化时执行
  clickFn?: (formObj: any, formData: formDataType) => void, // button 点击触发
  uploadFn?: (file: File) => Promise<uploadRsType>, // file、img 上传时执行
  changeFn?: (value: any, formObj: any, formData: formDataType) => void, // 值变化时执行
  showBigImageFn?: (src: string) => void // 点击查看大图接口函数
}

export interface inputCacheType {
  param?: formItemType | null,
  valObj: inputValueObjType,
  rowIndex?: number[]
}
