export default function (): number {
  return (
    window.document.documentElement.scrollTop + window.document.body.scrollTop
  )
}
