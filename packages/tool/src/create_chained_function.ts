export default function createChainedFunction(...funcs: Function[]) {
  return function (...args: any[]) {
    funcs.forEach((fun) => {
      if (fun) {
        fun(...args)
      }
    })
  }
}
