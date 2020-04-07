function setIco(ico: string): void {
  const link = window.document.createElement('link')
  link.rel = 'shortcut icon'
  link.href = ico
  window.document.head.appendChild(link)
}

export default setIco
