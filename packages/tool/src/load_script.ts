function loadScript(url: string, cb: () => any): void {
  const elem = window.document.createElement('script')
  elem.type = 'text/javascript'
  elem.charset = 'utf-8'
  elem.addEventListener('load', cb, false)
  elem.src = url
  elem.crossOrigin = 'anonymous'
  window.document.body.appendChild(elem)
}

export default loadScript
