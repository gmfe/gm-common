function setIco(ico) {
  const link = window.document.createElement('link')
  link.rel = 'shortcut icon'
  link.href = ico
  window.document.head.appendChild(link)
}

export default setIco
