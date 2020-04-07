export default function getTag(args: any): string {
  return Object.prototype.toString.call(args)
}
