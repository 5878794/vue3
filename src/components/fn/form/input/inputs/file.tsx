import { inputCacheType } from '../input.type'
import inputStyle from '../css/inputStyle.module.scss'
import { ElInput, ElUpload, ElButton, UploadRequestOptions } from 'element-plus'

const uploadBtnText = '上传'
export default function (cache: inputCacheType, checkFiled: () => boolean) {
  const uploadRun = async (e: UploadRequestOptions) => {
    const file = e.file
    if (!cache.param?.uploadFn) {
      console.error(cache.param?.__keyLv__ + ' 未配置上传函数uploadFn！！')
      return
    }

    if (typeof cache.param?.isUploading === 'boolean') {
      cache.param.isUploading = true
    }

    const src = await cache.param?.uploadFn(file).catch(() => {
      return ''
    })

    if (typeof cache.param?.isUploading === 'boolean') {
      cache.param.isUploading = false
    }

    if (src) {
      cache.valObj.bindValue = src
      checkFiled()
    }
  }
  const checkFileType = () => {
    return true
  }
  const createButton = () => {
    if (cache.param?.disabled) {
      return null
    } else {
      return <ElButton size="default" type="primary" loading={cache.param?.isUploading}>{uploadBtnText}</ElButton>
    }
  }
  return <>
    <ElInput
      v-model={cache.valObj.showValue}
      class={[inputStyle.file_input, 'file_input']}
      disabled={true}
      placeholder={cache.param?.placeholder}
    />
    <ElUpload
      class={inputStyle.button}
      disabled={cache.param?.disabled}
      action="#"
      limit={999}
      show-file-list={false}
      // accept={prop.acceptType}
      http-request={uploadRun}
      before-upload={checkFileType}
    >
      {createButton()}
    </ElUpload>
  </>
}
