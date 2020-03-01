export default function get_element_position(element) {
  let top = element.offsetTop
  let left = element.offsetLeft
  let current = element.offsetParent
  while (current !== null) {
    top += current.offsetTop
    left += current.offsetLeft
    current = current.offsetParent
  }
  return {
    top,
    left
  }
}
