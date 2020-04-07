export default function contains(root: HTMLElement, n: HTMLElement): boolean {
  let node = n
  while (node) {
    if (node === root) {
      return true
    }
    node = node.parentNode as HTMLElement
  }

  return false
}
