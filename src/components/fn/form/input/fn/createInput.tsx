import {inputCacheType} from '../input.type'

// 动态加载 ../inputs/*.tsx 文件
import button from "../inputs/button";
import color from '../inputs/color';
import date from '../inputs/date';
import dateTime from "../inputs/dateTime";
import file from "../inputs/file";
import img from '../inputs/img';
import password from '../inputs/password'
import radio from "../inputs/radio";
import select from "../inputs/select";
import text from '../inputs/text'
import time from '../inputs/time'

// const inputFiles = require.context('../inputs/', false, /\.tsx$/)
const inputs: any = {
  button, color, date, dateTime, file, img, password, radio, select, text, time
}
// inputFiles.keys().forEach((key: string) => {
//   const moduleKey = key.replace(/(\.\/|\.tsx)/g, '')
//   inputs[moduleKey] = inputFiles(key).default
// })

// 创建各种输入框
export default function (cache: inputCacheType, checkFiled: () => boolean, root: any) {
  const createInput = () => {
    const type = cache.param?.type ?? ''
    if (inputs[type]) {
      return inputs[type](cache, checkFiled, root)
    } else {
      console.error('input类型未找到：' + type)
      return null
    }
  }

  return {
    createInput
  }
}
