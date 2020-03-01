import is from './is'

function setTitle(title) {
  window.document.title = title

  if (!is.weixin()) {
    return
  }

  const iframe = window.document.createElement('iframe')
  // 小程序原因，不用其他域名，否则小程序需要配置额外的业务域名，没有意义
  iframe.src = '/favicon.ico'
  iframe.style.position = 'absolute'
  iframe.style.left = '-1000px'
  iframe.style.top = '-1000px'

  const listener = () => {
    setTimeout(() => {
      iframe.removeEventListener('load', listener)
      setTimeout(() => {
        window.document.body.removeChild(iframe)
      }, 0)
    }, 0)
  }
  iframe.addEventListener('load', listener)
  window.document.body.appendChild(iframe)
}

export default setTitle
