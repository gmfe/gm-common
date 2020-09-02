import React, { ComponentType, ForwardRefRenderFunction } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'
import { Route } from 'react-router-dom'
import { parse, ParsedQuery } from 'query-string'
import type { RouteComponentProps } from 'react-router-dom'

type PageLocation<P> = Location & {
  query: ParsedQuery
  action: 'PUSH' | 'REPLACE' | 'POP'
  params: { [K in keyof P]?: string }
}

export type RoutePageProps<P> = RouteComponentProps<P> & {
  location: PageLocation<P>
}

function processReactRouterProps(props: {
  [key: string]: any
}): { [key: string]: any } {
  const newProps = Object.assign({}, props)
  newProps.location.query = parse(props.location.search)
  newProps.location.action = newProps.history.action
  newProps.params = props.match.params || {} // 不止 || 是否有意义
  return newProps
}

// copy react-router 的 withRouter ，补充 search => query 的转换。
// react-router 取参数是  queryString(location.search).xxx
// 现在是 location.query.xxx 即可

const withRouterCompatible = (
  Component: ForwardRefRenderFunction<any, any>,
): ComponentType => {
  const C = (props: { [key: string]: any }) => {
    const { wrappedComponentRef, ...remainingProps } = props
    return (
      <Route
        render={(routeComponentProps) => (
          <Component
            {...remainingProps}
            {...processReactRouterProps(routeComponentProps)}
            ref={wrappedComponentRef as any}
          />
        )}
      />
    )
  }

  C.displayName = `withRouter(${Component.displayName || Component.name})`
  C.WrappedComponent = Component
  C.propTypes = {
    wrappedComponentRef: PropTypes.func,
  }

  return hoistStatics(C, Component)
}

export default withRouterCompatible
export { processReactRouterProps }
