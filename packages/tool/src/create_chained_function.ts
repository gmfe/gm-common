export default function createChainedFunction(...funs: Function[]) {
  return function (...args: any[]) {
    funs.forEach((fun) => {
      if (fun) {
        fun(args)
      }
    })
  }
}
