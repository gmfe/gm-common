export default function createChainedFunction() {
  const args = arguments
  return function chainedFunction() {
    for (let i = 0; i < args.length; i++) {
      if (args[i] && args[i].apply) {
        args[i].apply(this, arguments)
      }
    }
  }
}
