import { inputCacheType } from '../input.type'

// canMdf=false 时渲染
export default function (cache: inputCacheType) {
  const createDiv = () => {
    // TODO canMdf=false 时
    return null
  }

  return {
    createDiv
  }
}
