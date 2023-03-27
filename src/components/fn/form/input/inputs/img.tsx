import { inputCacheType } from '../input.type'
import inputStyle from '../css/inputStyle.module.scss'
import { ElUpload, UploadFile, UploadRequestOptions } from 'element-plus'

export default function (cache: inputCacheType, checkFiled: () => boolean) {
  // 点击查看图片
  const handlePictureCardPreview = (file: UploadFile) => {
    const url = file.url?.toString() || ''

    if (!cache.param?.showBigImageFn) {
      console.error('未配置 showBigImageFn')
      return
    }

    cache.param?.showBigImageFn(url)
  }
  // 图片上传
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

    return src
  }
  // 上传成功
  const uploadOk = (src: string, obj: UploadFile) => {
    // 上传失败处理
    if (!src) {
      const n = cache.valObj.bindValue.indexOf(obj)
      cache.valObj.bindValue.splice(n, 1)
      return
    }

    checkFiled()
  }
  //  删除时
  const handleRemove = () => {
    checkFiled()
  }

  const checkFileType = () => {
    return true
  }

  return <>
    <ElUpload
      class={[inputStyle.img_wall]}
      disabled={cache.param?.disabled}
      on-preview={handlePictureCardPreview}
      action="#"
      limit={parseInt(cache.param?.limit ?? '10')}
      accept='image/*'
      http-request={uploadRun}
      before-upload={checkFileType}
      v-model:file-list={cache.valObj.bindValue}
      show-file-list={true}
      list-type="picture-card"
      on-success={uploadOk}
      on-remove={handleRemove}
    >
    </ElUpload>
  </>
}
