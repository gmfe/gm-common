export default function keyMirror(obj) {
  const ret = {}
  let key
  for (key in obj) {
    ret[key] = key
  }
  return ret
}
