import { registerNode as register, Util } from '@antv/g6'
import { ModelConfig } from '@antv/g6/lib/types'
import GGroup from '@antv/g-canvas/lib/group'
import { mat3 } from '@antv/matrix-util'
import { adjustPath } from './utils'
import { NODE_STATE, NODE_SUB_TYPE } from './graph_flow'

/** 配置 */
const round_w = 70 // 物料节点宽，若调整物料节点的宽高可能还需要调整图标的位置
const round_h = 50 // 物料节点高
const node_radius = 25 // 物料节点圆角

const circle_radius = 20 // 工序节点圆半径

export interface MaterialNodeConfig extends ModelConfig {
  r: number
  size: number[]
}

export interface ProcessNodeConfig extends ModelConfig {
  r: number
  color: string
  size: number[]
}

export function registerNode() {
  // 物料节点
  register(
    'material',
    {
      draw(cfg: MaterialNodeConfig, group: GGroup) {
        const color = cfg.color
        const w = (cfg.size && cfg.size[0]) || round_w
        const h = (cfg.size && cfg.size[1]) || round_h
        const x = cfg.x || 0
        const y = cfg.y || 0
        const r = (cfg.r as number) || node_radius // 圆角半径

        // 圆角rect
        const path = [
          ['M', x + r, y],
          ['L', x + w - r, y],
          ['Q', x + w, y, x + w, y + r],
          ['L', x + w, y + h - r],
          ['Q', x + w, y + h, x + w - r, y + h],
          ['L', x + r, y + h],
          ['Q', x, y + h, x, y + h - r],
          ['L', x, y + r],
          ['Q', x, y, x + r, y],
          ['Z'],
        ]
        const style = Util.mix(
          {
            path: path,
            fill: color,
          },
          cfg.style,
        )
        const keyShape = group.addShape('path', {
          attrs: {
            ...style,
          },
          draggable: true,
          name: 'round',
        })

        // 三角图标
        const tri_r = 5
        const tri_point = [w + 4, h / 2 - tri_r / 2]
        group.addShape('polygon', {
          attrs: {
            points: [
              [tri_point[0], tri_point[1]],
              [tri_point[0] + tri_r, tri_point[1] + tri_r / 2],
              [tri_point[0], tri_point[1] + tri_r],
            ],
            fill: '#666',
          },
        })

        // 投入图
        if (cfg.sub_type === NODE_SUB_TYPE.INPUT) {
          const ratio = h > w ? w / 226 : h / 226 / 1.5
          const product = group.addShape('path', {
            attrs: {
              path: adjustPath(`
              M167.5,59.1c-25.5-25.4-66.6-25.7-92.4-0.7l53.6,53.1h0.1c1.2,1.2,1.9,2.9,1.9,4.6c0,1.8-0.7,3.4-1.9,4.6
              s-2.9,1.9-4.6,1.9s-3.4-0.7-4.6-1.9l-53-52.2c-1.1,1.8-2.3,3.6-3.2,5.4L63,74.2c-1,2-2,4-2.8,6.1L9,187.5
              c-5.1,8.6-3.7,19.6,3.3,26.6c6.5,6.5,15.8,8.7,23.9,4.8c4.1-2,33.6-16,61.2-29.2l-32-31.6h-0.1c-2.6-2.6-2.6-6.7,0-9.3
              s6.7-2.6,9.3,0l35.4,34.9l38.1-18.1l3-1.5c18.7-9.6,31.7-27.6,35-48.3C189.3,95,182.4,74,167.5,59.1
              M176.3,3.1c-1.9,0-3.8,0.7-5.2,2.2c-1.4,1.4-2.2,3.2-2.2,5.2v39.7v0.1v0.3c0,1.8,0.7,3.6,2,4.9
              c1.3,1.3,3.1,2,4.9,2h40c2.7,0.1,5.3-1.2,6.6-3.6c1.4-2.3,1.4-5.2,0-7.5s-4-3.7-6.6-3.6h-22.1l15.6-15.6c2.1-2.1,2.7-5.2,1.6-7.9
              c-1.1-2.7-3.8-4.5-6.7-4.5c-1.9,0-3.8,0.8-5.2,2.2l-15.4,15.5V10.4C183.6,6.4,180.4,3.1,176.3,3.1
            `),
              fill: 'white',
            },
          })
          let matrix = product.getMatrix()
          if (!matrix) matrix = mat3.create() as number[]
          const newMatrix = Util.transform(matrix, [
            ['t', ratio * w + w / 2 + 80, h * ratio - h / 2 + 60], // 20padding值
            ['s', ratio, ratio],
          ])
          product.setMatrix(newMatrix)
        }

        // 包材
        if (cfg.sub_type === NODE_SUB_TYPE.PACK) {
          const ratio = h > w ? w / 210 : (h / 210) * 1.4
          const product = group.addShape('path', {
            attrs: {
              path: adjustPath(`
              M34.4,57.6c-5.3-2.3-10.7-4.7-16-7.1c-0.9-0.4-1.3-0.5-1.3-1.2v-4.7c0-0.6,0.3-1.4,1.1-1.1      l16.4,7.3c1.5,0.7,1.1,0.8,1.1,3.6v2.3C35.7,57.1,35.3,58,34.4,57.6L34.4,57.6z M48,47.1L6.3,29.5c-1.1,0-2,0.9-2,2V74      c0,0.5-0.3,1.1,2,2L48,95.9c1.1,0,2-0.9,2-2V50.1C50,48.9,50,47.9,48,47.1L48,47.1z M55,93.9c0,1.1,0.9,2,2,2L98.7,74      c1.6-1,2-2.8,2-5.5v-37c0-0.5-0.2-1-0.6-1.4c-0.4-0.4-0.9-0.6-1.4-0.6h0L57,47.1c-2,0.8-2,1.8-2,2.9V93.9z M53.7,43.9      c-1.3,0.5-1,0.6-2.6,0L7.3,25.5c-0.4-0.3-0.6-0.8-0.6-1.3c0-0.5,0.2-1,0.5-1.3l0,0L49.9,4.5c1-0.5,2-0.7,3.7,0l43.5,18      c0.7,0.7,0.8,1.9,0.1,2.6L53.7,43.9z
            `),
              fill: 'white',
            },
          })
          let matrix = product.getMatrix()
          if (!matrix) matrix = mat3.create() as number[]
          const newMatrix = Util.transform(matrix, [
            ['t', w / 2 / ratio - w / 2 - 15, h * ratio - h / 2 + 30],
            ['s', ratio, ratio],
          ])
          product.setMatrix(newMatrix)
        }

        // 产出图
        if (
          cfg.sub_type === NODE_SUB_TYPE.OUTPUT ||
          cfg.sub_type === NODE_SUB_TYPE.BY_PRODUCT
        ) {
          const ratio = h > w ? w / 226 : (h / 226) * 1.4
          const product = group.addShape('path', {
            attrs: {
              path: adjustPath(`
              M27.2,77.4c0.6,0,1.1-0.2,1.6-0.6c0.5-0.5,0.6-1,0.6-1.6V62.7c0-0.8-0.3-1.6-1.1-2.1c-0.8-0.5-1.6-0.5-2.4,0
              s-1.1,1.1-1.1,2.1v6.9l-4.8-5c-0.6-0.6-1.6-0.8-2.6-0.5S16,65.2,16,66.2c0,0.6,0.2,1.1,0.6,1.6l4.8,4.8h-6.8c-1.3,0-2.2,1-2.2,2.2
              c0,0.6,0.2,1.1,0.6,1.6c0.6,0.9,1.1,1,1.7,1H27H27.2z
              M99.9,73l-1.4,0.8c-6.6,3.7-7.7,9.1-7.8,12.2c5.3-5.6,10.9-6.6,11-6.6l1.8-0.3l-0.6,1.8
              c-1,2.9-1.4,5.3-1.4,7.5c0,3,0.8,5.3,1.4,6.7c1.6-7.8,7.2-13.1,7.5-13.3l0.6-0.6l0.6,0.6c0.3,0.2,5.9,5.4,7.5,13.3
              c0.8-1.4,1.4-3.7,1.4-6.7c0-2.1-0.3-4.6-1.4-7.5l-0.6-1.8l1.8,0.3c0.2,0,5.8,1.1,11,6.6c-0.2-3-1.3-8.5-7.8-12.2l-1.4-0.8l1.4-1
              c0.2-0.2,3.5-2.6,10.1-3c-3.4-2.2-10.2-5.1-17.4,0l-1,0.8L111,61l-4.2,8.8l-1-0.8c-7.2-5.1-14.1-2.2-17.4,0c6.6,0.6,9.9,3,10.1,3
              L99.9,73z
              M165.2,85.1c7.5,2.1,3.8,9.4,3.8,9.4c0.6-1.6,4.3-0.8,4.3-0.8c-0.5-2.9,4-3.5,4-3.5c-0.8-4,4.5-2.6,4.2-3.8
              c-0.3-1.1,0-2.6,0.8-3.5c0.8-1,1.9-1.6,3.2-1.8c-9.9-5.8-23.2-1.8-23.2-1.8C164.4,80.3,165.7,82.7,165.2,85.1z
              M179.7,109.7c-2.2-1.8-13.3-6.1-12.3-19.4c0,0,0.2-3.4-4.2-3.7c0,0,2.6-5.1-3.4-5.4l0.2-3.4l0.2-1.8
              c0,0-5.6,3.8-13.4,8.8c-1.1,0.8-2.4,2.1-3.5,3.8c-3-6.9-8.5-12.5-15.7-16c-0.5,0.2-1,0.3-1.1,0.5c6.4,4.3,7.4,10.6,7.4,13.6
              c0,1.3-0.2,1.9-0.2,2.1l-0.3,2.2l-1.4-1.8c-3.5-4.5-7.5-6.4-9.8-7.2c0.6,2.4,1,4.5,1,6.2c0,6.6-3.2,10.1-3.4,10.2l-1.6,1.8
              l-0.2-2.4c-0.5-6.9-4.8-12.2-6.6-13.9c-1.8,1.8-6.1,7-6.6,13.9l-0.2,2.4l-1.6-1.8c-0.2-0.2-3.4-3.8-3.4-10.2c0-1.9,0.3-4,1-6.4
              c-2.2,0.8-6.1,2.7-9.8,7.2l-1.4,1.8l-0.3-2.2c-0.2-0.6-0.2-1.4-0.2-2.1c0-3.2,1-9.3,7.4-13.6c-0.3-0.2-0.8-0.3-1.3-0.5
              C84.2,77.6,77,88,77,99.8c0,9.6,4.6,17.8,12,23.6h44.5c3.2-2.4,5.6-5.3,7.6-8.5c1.7,3.2,4.5,6.2,8.3,8.5h6.3
              c-2.2-1.8-4.1-4.1-5.7-6.8c-2.2-3.8-5.3-0.8-7-5c0.3-0.8,0.8-1.8,1-2.6c1.1,1.1,2.2,2.1,3.5,3c1.9,1.8-4-12,0.8-19.7
              c0,0-0.8,9.1,0.3,14.1c0,0,5.4-3.7,7.4-7.7c0,0,0.3,5.6-6.4,10.9c1,3,2.7,5.9,5,8.3c3-2.7,5.6-5.9,8-9.3c-0.6,4.3-2.6,8.3-5.4,11.7
              c1.2,1.1,2.6,2.2,4.1,3.1h2.4c1.9-2.2,3.5-4.5,4.6-7.2c0,2.5-0.7,4.9-1.9,7.2h17.6C187.2,117.3,181.8,111.4,179.7,109.7z
              M70.8,99.7l-9.9,10.1c-0.8,0.8-2.1,0.8-2.9,0c-0.8-0.8-0.8-2.1,0-2.9l10.9-11L63.2,84l-0.5-1
              c-3-5.8-8.6-9.9-15-10.9c-6.6-1-13.1,1.1-17.6,5.8c-8,8-8,20.8-0.2,28.8l16.6-16.6c0.3-0.3,1-0.6,1.4-0.6c0.6,0,1.1,0.2,1.4,0.6
              c0.3,0.3,0.6,1,0.6,1.4c0,0.4-0.2,1.1-0.6,1.4l-16.1,16.5c0.6,0.3,1.1,0.6,1.6,1c0.6,0.3,1.3,0.6,1.9,1l25.1,12h18.4
              c0.5-1.5,0.4-3.1-0.3-4.7C79.3,117.4,74.9,108.1,70.8,99.7z
              M187.6,76.3c-0.2,1.9-0.2,3.8,0.2,5.8c0.2,1.9-5.4-1.1-4.6,5.8c0,0-4.5-0.6-3.7,4.3c-1.3-0.2-2.6,0.2-3.5,1
              c-1,0.8-1.4,2.1-1.4,3.4s-5.6-1.6-4.8,1c0.8,2.4,2.2,4,9.4,9.6c7.2,5.8,8,10.4,6.6,15.2c0,0,5.3-4,6.7-6.7c0,0-5.9-5.9-5.8-11
              c0,0,6.7,7.7,7.5,8.3l1.8-6.4c0,0-5.8-6.4-6.1-9.8c0,0,5.6,5.4,7.2,6.6c0,0,0.5-9.1,0-10.6c-0.5-1.4,4.8,4.2,0.8,19.4
              c2.2-1,4-2.7,5.3-4.8c1.1-2.1,1,5.9-8,9.9c0,0-2.2,3.2-5.1,6.1h4.6c5.5-3.1,11.2-8.6,11.8-19.1C207.4,87.3,195.6,87,187.6,76.3z
            `),
              fill: 'white',
            },
          })
          let matrix = product.getMatrix()
          if (!matrix) matrix = mat3.create() as number[]
          const newMatrix = Util.transform(matrix, [
            ['t', 0, h * ratio - h / 2], // 20padding值
            ['s', ratio, ratio],
          ])
          product.setMatrix(newMatrix)
        }

        if (cfg.sub_type === NODE_SUB_TYPE.BY_PRODUCT) {
          const ratio = h > w ? w / 200 : h / 200 / 1.8
          const circle_r = 15
          group.addShape('circle', {
            attrs: {
              x: w - 6,
              y: h - 6,
              r: circle_r,
              fill: 'white',
            },
          })
          // 副产品
          const byProduct = group.addShape('path', {
            attrs: {
              path: adjustPath(`
            M101.9,11.4C53,11.4,13.2,51.1,13.2,100c0,48.9,39.8,88.6,88.6,88.6c48.9,0,88.6-39.8,88.6-88.6
            C190.5,51.1,150.8,11.4,101.9,11.4z
            M101.9,177.1c-42.5,0-77.1-34.6-77.1-77.1c0-42.5,34.6-77.1,77.1-77.1
            c42.5,0,77.1,34.6,77.1,77.1C179,142.5,144.4,177.1,101.9,177.1z
            M57.1,68V58h57.1v10H57.1z M59.9,145.6v-44.8h52.7v44.8h-12v-4.8H71.5v4.8H59.9z M63.5,96.4v-24h45.6v24H63.5z M71.5,110
	          v7.2h9.2l0-7.2H71.5z M71.5,125.6v6.8h9.2v-6.8H71.5z M96.7,86.8V82H75.9v4.8H96.7z M100.7,117.2V110h-9.2v7.2L100.7,117.2z
	          M91.5,125.6v6.8h9.2v-6.8H91.5z M134.6,130.8V54.4h12V134c0,6.9-4,10.7-12,11.2c-3.7,0-8.8,0-15.2,0c-0.3-1.1-0.5-2.7-0.8-4.8
	          c0-1.6-0.4-3.9-1.2-6.8c0.5,0,1.3,0,2.4,0c3.5,0.5,7.2,0.8,11.2,0.8C133.5,134.4,134.6,133.2,134.6,130.8z M127.9,60.8v64.3h-10.4
	          V60.8H127.9z
          `),
              fill: cfg.color,
            },
          })
          let matrix = byProduct.getMatrix()
          if (!matrix) matrix = mat3.create() as number[]
          const newMatrix = Util.transform(matrix, [
            [
              't',
              w / ratio - circle_r / ratio - 5 / ratio,
              h / ratio - circle_r / ratio - 5 / ratio,
            ],
            ['s', ratio, ratio],
          ])
          byProduct.setMatrix(newMatrix)
        }

        if (cfg.label) {
          group.addShape('text', {
            attrs: {
              x: 0 + w + 12, // 居中
              y: 0 + h / 2,
              textAlign: 'left',
              textBaseline: 'middle',
              text: cfg.label,
              fill: '#666',
              fontSize: 16,
              fontWeight: 500,
            },
            name: 'text-shape',
            // 设置 draggable 以允许响应鼠标的图拽事件
            draggable: true,
          })
        }

        return keyShape
      },
    },
    'single-node',
  )

  // 工序节点
  register('process', {
    draw(cfg: ProcessNodeConfig, group: GGroup) {
      const style = Util.mix(
        {
          r: cfg.r || circle_radius,
          x: round_w / 2, //
          y: round_h / 2, //
        },
        cfg.style,
      )
      const keyShape = group.addShape('circle', {
        attrs: {
          ...style,
          stroke: cfg.color,
          fill:
            cfg.state === NODE_STATE.PREPARE || cfg.state === NODE_STATE.STARTED
              ? 'white'
              : cfg.color,
          lineWidth: 2,
        },
      })

      // 三角图标
      const w = circle_radius * 2
      const h = circle_radius * 2
      const tri_r = 5
      const tri_point = [w / 2 + round_w / 2 + 4, round_h / 2 - tri_r / 2]
      group.addShape('polygon', {
        attrs: {
          points: [
            [tri_point[0], tri_point[1]],
            [tri_point[0] + tri_r, tri_point[1] + tri_r / 2],
            [tri_point[0], tri_point[1] + tri_r],
          ],
          fill: '#666',
        },
      })

      // 准备中图
      if (cfg.state === NODE_STATE.PREPARE) {
        group.addShape('path', {
          attrs: {
            path: [
              ['M', round_w / 2 - circle_radius / 2, round_h / 2],
              ['L', round_w / 2 + circle_radius / 2, round_h / 2],
            ],
            lineCap: 'round',
            lineWidth: 4,
            stroke: cfg.color,
          },
        })
      }

      // 进行中图
      if (cfg.state === NODE_STATE.STARTED) {
        const ratio = (circle_radius * 2) / 226.8 / 1.2 // 226.8为svg viewBox值
        // 转化为G6支持的格式
        const path1 = adjustPath(`
        M113,169.9c0,0.7-0.6,1.3-1.4,1.3c-31.7-0.7-57.4-26.9-57.4-58.7c0-9.5,2.7-18.9,6.5-26.6  c0.2-0.5,0.2-1.1-0.2-1.5L47.8,71.6c-0.6-0.6-1.7-0.5-2.1,0.3c-6.4,12.3-10.9,25.5-10.9,40.5c0,42.6,34.5,77.6,77,78.3  c0.7,0,1.3,0.6,1.3,1.3V217c0,1.2,1.4,1.8,2.2,0.9l36-36c0.5-0.5,0.5-1.4,0-1.9l-36-36c-0.9-0.9-2.2-0.2-2.2,0.9L113,169.9  L113,169.9z
        M113,34.1V8c0-1.2-1.4-1.8-2.2-0.9L74.8,43c-0.5,0.5-0.5,1.4,0,1.9l36,36c0.9,0.9,2.2,0.2,2.2-0.9V55.1  c0-0.7,0.6-1.3,1.4-1.3c31.7,0.7,57.4,26.9,57.4,58.7c0,9.4-2.7,18.9-6.5,26.6c-0.2,0.5-0.2,1.1,0.2,1.5l12.8,12.8  c0.6,0.6,1.7,0.5,2.1-0.3c6.4-12.3,10.9-25.5,10.9-40.5C191.3,69.4,156.1,34.1,113,34.1L113,34.1z 
      `)

        // 循环图标
        const cycle = group.addShape('path', {
          attrs: {
            path: path1,
            fill: cfg.color,
            lineWidth: 1,
          },
        })
        let matrix = cycle.getMatrix()
        if (!matrix) matrix = mat3.create() as number[]
        const newMatrix = Util.transform(matrix, [
          [
            't',
            round_w / 2 / ratio - circle_radius / ratio + 20,
            round_h / 2 / ratio - circle_radius / ratio + 20,
          ], // 20padding值
          ['s', ratio, ratio],
        ])
        cycle.setMatrix(newMatrix)
      }

      // 完成图
      if (cfg.state === NODE_STATE.FINISHED) {
        const point_x = round_w / 2 - 2 // 这里是round节点的w
        const point_y = round_h / 2 - 2 // 这里是round节点的w
        group.addShape('path', {
          attrs: {
            path: [
              ['M', point_x - circle_radius / 2 + 2, point_y + 2],
              ['L', point_x, point_y + circle_radius / 3 + 2],
              [
                'L',
                point_x + circle_radius / 2 + 2,
                point_y - circle_radius / 2 + 2 + 2,
              ],
            ],
            lineCap: 'round',
            lineJoin: 'round',
            lineWidth: 4,
            stroke: 'white',
          },
        })
      }

      if (cfg.label) {
        group.addShape('text', {
          attrs: {
            x: circle_radius + round_w / 2 + 12,
            y: circle_radius / 2 + round_h / 2 - 10,
            textAlign: 'left',
            textBaseline: 'middle',
            text: cfg.label,
            fill: '#666',
            fontSize: 14,
          },
          name: 'text-shape',
          draggable: true,
        })
      }

      return keyShape
    },
  })
}
