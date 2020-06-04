/**
 * 系统时间合法性校验,2020-01-01T00:00:00 以后的时间判定为合法
 */
export default function envTimeDetect(): boolean {
  const envTime = new Date()
  const validTime = new Date('2020-01-01T00:00:00')

  return envTime.getTime() - validTime.getTime() > 0
}
