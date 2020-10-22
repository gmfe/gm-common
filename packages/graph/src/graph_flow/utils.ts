import _ from 'lodash'

const reg = /(M(\d|,|\.)+)/g
const checked = /\s\d/g
// G6@3.8.1存在问题，直接使用svg的path绘制出来的图像会错位，解决方法是复制一遍M命令
export function adjustPath(path: string) {
  // 校验G6支持的格式
  if (checked.test(path)) {
    throw new Error('path不支持，请将svg放入AI导出再使用')
  }
  return path.replace(reg, '$&z$&')
}
