import React from 'react'
import { GraphFlow, NODE_TYPE, NODE_STATE, NODE_SUB_TYPE } from './index'

export const Normal = () => {
  return (
    <GraphFlow
      data={{
        nodes: [
          {
            id: '1',
            type: NODE_TYPE.MATERIAL,
            sub_type: NODE_SUB_TYPE.INPUT,
            label: '萝卜',
            color: 'orange',
          },
          {
            id: '2',
            type: NODE_TYPE.PROCESS,
            state: NODE_STATE.PREPARE,
            label: '切配',
            color: 'orange',
          },
          {
            id: '3',
            type: NODE_TYPE.MATERIAL,
            sub_type: NODE_SUB_TYPE.OUTPUT,
            label: '萝卜丝',
            color: 'orange',
          },
        ],
        edges: [
          {
            source: '1',
            target: '2',
            id: '1-2',
          },
          {
            source: '2',
            target: '3',
            id: '2-3',
          },
        ],
      }}
      options={{
        layout: {
          rankdir: 'TB',
        },
      }}
    />
  )
}

export default {
  title: 'graph/graph_bom',
}
