export default function keyMirror(obj: {
  [key: string]: any
}): { [key: string]: string } {
  const ret: { [key: string]: string } = {}
  for (const key in obj) {
    ret[key] = key
  }
  return ret
}
