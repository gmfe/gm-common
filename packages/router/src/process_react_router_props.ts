import { parse, ParsedQuery } from 'query-string'
import type { RouteComponentProps } from 'react-router-dom'

type PageLocation<P> = Location & {
  query: ParsedQuery
  action: 'PUSH' | 'REPLACE' | 'POP'
  params: { [K in keyof P]?: string }
}

export default function processReactRouterProps(props: {
  [key: string]: any
}): { [key: string]: any } {
  const newProps = Object.assign({}, props)
  newProps.location.query = parse(props.location.search)
  newProps.location.action = newProps.history.action
  newProps.params = props.match.params || {} // 不止 || 是否有意义
  return newProps
}

export type RoutePageProps<P> = RouteComponentProps<P> & {
  location: PageLocation<P>
}
