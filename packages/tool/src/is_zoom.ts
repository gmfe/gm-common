/**
 * 检测浏览器缩放. 文章: https://www.yuque.com/iyum9i/uur0qi/cup15r
 */
export default function isZoom(): boolean {
  const div = document.createElement('div')
  div.style.fontSize = '1px'
  div.innerText = 'test'

  document.body.appendChild(div)
  const h = window.getComputedStyle(div).fontSize

  // 检测结束,删除节点
  document.body.removeChild(div)

  // 不等于12,说明浏览器使用了缩放
  return h !== '12px'
}
