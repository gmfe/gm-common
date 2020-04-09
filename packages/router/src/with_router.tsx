import React, { ComponentType, ForwardRefRenderFunction } from 'react'
import PropTypes from 'prop-types'
import hoistStatics from 'hoist-non-react-statics'
import { Route } from 'react-router'
import processReactRouterProps from './process_react_router_props'

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
