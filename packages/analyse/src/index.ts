import { report } from './util'

// todo
// reportFirstScreen 上报首屏信息

// 上报到企业微信的机器人，用户主动上报用。 否则太频繁。同时落到 /data/logs/fe/more/common.log
function reportToQy(platform: string, data: any) {
  // try catch，可能 JSON.stringify 出错
  try {
    // 简单文本即可
    report('https://trace.guanmai.cn/api/webhook/qy', {
      msgtype: 'text',
      text: {
        content: JSON.stringify({
          // 上报到企业微信带上知道是那个项目发生的
          platform,
          ...data,
        }),
      },
    })
  } catch (err) {
    console.warn(err)
  }
}

export { report, reportToQy }
