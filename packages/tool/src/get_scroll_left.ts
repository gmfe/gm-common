export default function (): number {
  return (
    window.document.documentElement.scrollLeft + window.document.body.scrollLeft
  )
}
