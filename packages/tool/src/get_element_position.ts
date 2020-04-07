export default function getElementPosition(
  element: HTMLElement,
): { top: number; left: number } {
  let top = element.offsetTop
  let left = element.offsetLeft
  let current = element.offsetParent
  while (current !== null) {
    top += (current as HTMLElement).offsetTop
    left += (current as HTMLElement).offsetLeft
    current = (current as HTMLElement).offsetParent
  }
  return {
    top,
    left,
  }
}
