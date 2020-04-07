import { parse } from 'query-string'

export default function processReactRouterProps(props: {
  [key: string]: any
}): { [key: string]: any } {
  const newProps = Object.assign({}, props)
  newProps.location.query = parse(props.location.search)
  newProps.location.action = newProps.history.action
  newProps.params = props.match.params || {} // 不止 || 是否有意义
  return newProps
}
