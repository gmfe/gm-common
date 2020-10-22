import {
  Bom,
  Bom_Process,
  OutputType,
  TaskProcess,
  TaskProcess_State,
} from 'gm_api/src/production'
import * as merchandise from 'gm_api/src/merchandise'
import _ from 'lodash'
import {
  NODE_TYPE,
  FlowNode,
  FlowEdge,
  NODE_SUB_TYPE,
  NODE_STATE,
} from './graph_bom'

const reg = /(M(\d|,|\.)+)/g
const checked = /\s\d/g
// G6@3.8.1存在问题，直接使用svg的path绘制出来的图像会错位，解决方法是复制一遍M命令
export function adjustPath(path: string) {
  // 校验G6支持的格式
  if (checked.test(path)) {
    throw new Error('path不支持，请将svg放入AI导出再使用')
  }
  return path.replace(reg, '$&z$&')
}

function shuffleColor(bom_id: string) {
  let n = Number(bom_id[bom_id.length - 1])
  if (n === defaultColors.length / 2) n += 1
  const newDefaultColors = [...defaultColors]

  for (let i = 0; i < n; i++) {
    const ret = newDefaultColors.splice(n)
    newDefaultColors.unshift(...ret)
  }
  return newDefaultColors
}

export interface TransToG6DataOptions {
  /** 炫彩，开启后各个节点的色值将不同, 默认开启 */
  colorful?: boolean
  /** 随机炫彩，开启后每次生成流程图颜色将随机变化，默认开启  */
  randomColor?: boolean
  /** 颜色持久化，开启后将根据bom_id生成不同颜色，默认开启 */
  persist?: boolean
}

const defaultColors = [
  '#FD8A0E',
  '#FEC771',
  '#FFA41B',
  '#EE5F57',
  '#FF5F40',
  '#FD4700',
  '#00BCD4',
  '#42B883',
  '#14B1AB',
  '#15CDA8',
  '#64E291',
  '#9DD8C8',
  '#A0C334',
  '#07689F',
  '#7B88FF',
  '#4D80E4',
  '#0779E4',
  '#AA26DA',
  '#6C5CE7',
  '#6F4A8E',
  '#EF312B',
  '#B83B5E',
  '#FE346E',
]

const defaultColor = '#56a3f2'

/**
 * 业务方法
 * 将后台BOM结构转化为G6要求的格式
 * @param bom 后台Bom类型
 * @param skuMap sku信息
 * @param taskProcesses 可选，流程图如果需要状态，需要传入
 * @param option 可选，配置项
 */
export function transToG6Data(
  bom: Bom,
  skuMap?: { [key: string]: merchandise.Sku },
  taskProcesses?: TaskProcess[],
  options: TransToG6DataOptions = {},
) {
  options = Object.assign(
    {
      colorful: true,
      randomColor: true,
      persist: true,
    },
    options,
  )
  const nodes: FlowNode[] = []
  const links: FlowEdge[] = []
  // 记录所有节点，方便获取
  const recordNode: { [key: string]: any } = {}
  // 记录有状态的节点
  const recordStateNode: { [key: string]: TaskProcess } = {}
  // 色值集合
  const colors = getColors()

  function record(id: string, node: FlowNode) {
    if (!recordNode[id]) recordNode[id] = node
  }

  function getColors() {
    if (options.randomColor) {
      if (options.persist && bom) return shuffleColor(bom.bom_id)
      return _.shuffle([...defaultColors])
    } else {
      return [...defaultColors]
    }
  }

  /** 查找状态节点 */
  function getStateNode(id: string) {
    if (!id || id === '0') return null
    if (recordStateNode[id]) return recordStateNode[id]
    else {
      const node = _.find(taskProcesses, (p) => p.process_id === id)
      if (node) {
        recordStateNode[id] = node
      }
      return node
    }
  }

  function getNodeState(id: string) {
    const stateNode = getStateNode(id)
    if (!stateNode) return undefined
    switch (stateNode.state!) {
      case TaskProcess_State.STATE_PREPARE:
        return NODE_STATE.PREPARE

      case TaskProcess_State.STATE_STARTED:
        return NODE_STATE.STARTED
      case TaskProcess_State.STATE_FINISHED:
        return NODE_STATE.FINISHED
      default:
        return NODE_STATE.PREPARE
    }
  }

  function getColor() {
    const color = colors.shift()
    colors.push(color!)
    return options.colorful ? color : defaultColor
  }

  function getLinkColor(id: string) {
    const state = getNodeState(id)
    if (state === NODE_STATE.FINISHED || state === NODE_STATE.STARTED) {
      return options.colorful ? recordNode[id].color : defaultColor
    } else {
      return '#ddd'
    }
  }

  function getActualId(id: string) {
    return id.split('_')[1]
  }

  function createProcessNode(process: Bom_Process) {
    function getProcessNodeColor() {
      if (process.inputs!.length === 1) {
        const materialId = process.inputs![0].material!.sku_id
        const materialNode = recordNode[materialId]
        const state = getNodeState(process.process_id)
        if (state === NODE_STATE.FINISHED || state === NODE_STATE.STARTED) {
          return materialNode.color
        } else {
          return '#ddd'
        }
      } else {
        const materialId = process.outputs![0].material!.sku_id
        const materialNode = recordNode[materialId]
        const state = getNodeState(process.process_id)
        if (state === NODE_STATE.FINISHED || state === NODE_STATE.STARTED) {
          return materialNode.color
        } else {
          return '#ddd'
        }
      }
    }

    const id = process.process_id!
    if (recordNode[id]) return recordNode[id]
    const node = {
      id: id,
      type: NODE_TYPE.PROCESS,
      state: getNodeState(id),
      label: getStateNode(id)?.process_name,
      color: getProcessNodeColor(),
      input: [],
      output: [],
    }
    record(id, node)
    nodes.push(node)
    return node
  }

  function getRanDomId() {
    return Math.random().toString(36).slice(-8)
  }

  /**
   * 创建物料节点的时候会创建links
   */
  function createMaterialNode(process: Bom_Process) {
    // 最后一道工序或者第一道，将形成一个节点
    const inputs = process.inputs!
    const outputs = process.outputs!
    for (let i = 0; i < inputs.length; i++) {
      // 处理物料节点
      const input = inputs[i]
      let id = input.prev_process_id!
      if (input.prev_process_id === '0') {
        // 投入的物料可能相同即sku_id相同，不能把sku_id作为id
        // 这里重新生成了的sku_id
        id = getRanDomId() + '_' + input.material?.sku_id!
        input.material!.sku_id = id
        const node = {
          id,
          type: NODE_TYPE.MATERIAL,
          color: getColor(),
          sub_type: NODE_SUB_TYPE.INPUT,
          label: skuMap && skuMap[getActualId(id)].name,
          output: [process.process_id],
        }
        nodes.push(node)
        record(id, node)
      }

      // 创建link
      createLink(id, process.process_id)

      // 记录工序节点输入
      const processNode = recordNode[process.process_id]
      if (processNode) {
        processNode.input.push(id)
      }
    }
    for (let i = 0; i < outputs.length; i++) {
      const output = outputs[i]
      let id = output.next_process_id!
      if (output.next_process_id === '0') {
        id = getRanDomId() + '_' + output.material?.sku_id!
        output.material!.sku_id = id
        const node = {
          id,
          type: NODE_TYPE.MATERIAL,
          sub_type:
            output.type === OutputType.OUTPUT_TYPE_EXTRA
              ? NODE_SUB_TYPE.BY_PRODUCT
              : NODE_SUB_TYPE.OUTPUT,
          color: getColor(),
          label: skuMap && skuMap[getActualId(id)].name,
          input: [output.next_process_id],
        }
        nodes.push(node)
        record(id, node)
      }

      // 创建link
      createLink(process.process_id, id)

      // 记录工序节点输出
      const processNode = recordNode[process.process_id]
      if (processNode) {
        processNode.output.push(id)
      }
    }
  }

  function createLink(targetId: string, sourceId: string) {
    if (targetId === sourceId) return
    const id = `${targetId}_${sourceId}`
    const isExist = _.findIndex(links, (link) => link.id === id) !== -1
    if (!isExist) {
      const link = {
        target: targetId,
        source: sourceId,
        id: id,
      }
      links.push(link)
    }
  }

  function colorfulLinks(links: FlowEdge[]) {
    for (let i = 0; i < links.length; i++) {
      const link = links[i]
      link.color = getLinkColor(link.source)
    }
  }

  if (!bom) {
    return {
      nodes: [],
      edges: [],
    }
  }

  const processes = bom.processes?.processes!
  for (let i = 0; i < processes.length; i++) {
    const process = _.cloneDeep(processes[i])

    createMaterialNode(process) // 工序的输入或者输出可能是一个节点
    createProcessNode(process) // 工序本身是一个节点
  }
  // 为所有link添加颜色
  colorfulLinks(links)
  return {
    nodes: nodes,
    edges: links,
  }
}
