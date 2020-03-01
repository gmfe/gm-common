import queryString from 'query-string'

export default function processReactRouterProps (props) {
  const newProps = Object.assign({}, props)
  newProps.location.query = queryString.parse(props.location.search)
  newProps.location.action = newProps.history.action
  newProps.params = props.match.params || {} // 不止 || 是否有意义
  return newProps
}
