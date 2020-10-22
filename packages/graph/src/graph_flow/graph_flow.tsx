import React, { FC, useRef, useEffect } from 'react'
import { Graph } from '@antv/g6'
import { IGraph } from '@antv/g6/lib/interface/graph'
import { merge } from 'lodash'
import { NodeConfig, EdgeConfig, GraphOptions } from '@antv/g6/lib/types'

import { registerNode } from './register_node'

/** 节点类型
 *  - 物料节点
 *  - 工序节点
 */
export enum NODE_TYPE {
  'MATERIAL' = 'material',
  'PROCESS' = 'process',
}

/**
 * 节点副类型
 * - 副产物
 * - 产物
 * - 投入
 */
export enum NODE_SUB_TYPE {
  'BY_PRODUCT' = 'by_product', // 副产品
  'OUTPUT' = 'output', // 产出
  'INPUT' = 'input', // 投入
}

/** 节点状态（目前只有工序节点才有） */
export enum NODE_STATE {
  'PREPARE' = 1,
  'STARTED' = 2,
  'FINISHED' = 3,
}

export interface FlowNode extends NodeConfig {
  id: string
  type: NODE_TYPE
  sub_type?: NODE_SUB_TYPE
  label?: string
  state?: NODE_STATE
  color?: string
}
export interface FlowEdge extends EdgeConfig {
  target: string
  source: string
  id: string
}
export interface FlowProps {
  data: {
    nodes: FlowNode[]
    edges: FlowEdge[]
  }
  options?: Partial<GraphOptions>
}

let graph: IGraph = null!
const GraphFlow: FC<FlowProps> = ({ data, options = {} }) => {
  const container = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const flowData = {
      nodes: data.nodes,
      edges: data.edges,
    }
    if (!graph) {
      registerNode()
      // @ts-ignore
      const containerWidth = container.current.parentNode!.offsetWidth
      graph = new Graph(
        merge(
          {
            container: container.current as string | HTMLElement,
            width: containerWidth,
            height: 500,
            maxZoom: 1,
            modes: {
              default: ['drag-canvas', 'zoom-canvas'],
            },
            defaultEdge: {
              type: 'polyline',
              style: {
                lineWidth: 3,
              },
            },
            defaultNode: {
              anchorPoints: [
                [0.5, 1],
                [0.5, 0],
              ],
            },
            layout: {
              type: 'dagre',
              rankdir: 'BT',
              ranksep: 20,
            },
          },
          options,
        ),
      )
    }
    graph.data(flowData)
    graph.render()
    graph.fitView()
    return () => {
      graph.destroy()
      graph = null!
    }
  }, [])

  return <div ref={container} />
}

export default GraphFlow
