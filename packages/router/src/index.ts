import history, { processHistory } from './history'
import withRouter, { processReactRouterProps } from './with_router'
import type { RoutePageProps } from './with_router'
import AutoRouter from './auto_route'
import useGMLocation from './use_gm_location'

export {
  processHistory,
  processReactRouterProps,
  withRouter,
  AutoRouter,
  history,
  useGMLocation,
}

export type { RoutePageProps }
