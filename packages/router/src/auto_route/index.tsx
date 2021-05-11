import React, { ComponentType, FC, memo } from 'react'
import { Route, Redirect, Switch, RouteComponentProps } from 'react-router-dom'
import Loadable, { LoadingComponentProps } from 'react-loadable'
import _ from 'lodash'
import { Loading, NoMatch } from './util'

interface RouteBaseProps {
  path: string
  loader(): Promise<ComponentType<RouteComponentProps>>
}

interface RedirectBaseProps {
  to: string
  from: string
}

interface NavConfigItem {
  link: string
  sub?: NavConfigItem[]
}

type NavConfig = NavConfigItem[]

interface NavRouteMapType {
  [key: string]: {
    link: string
    disabled: boolean
  }
}

// src/pages index.page.xxx
// eslint-disabled-next-line
const req = require.context('@/pages', true, __AUTO_ROUTER_REG__, 'lazy')

function generateRouteList() {
  const routeList: RouteBaseProps[] = []

  _.each(req.keys(), (key) => {
    // ./home/index.page.xxx => /home

    // slice(1) 去掉 .
    // slice(0, -1) 去掉 index.page.xxx
    // 剩下就是路由部分
    const pathArr = key.slice(1).split('/').slice(0, -1)

    routeList.push({
      path: pathArr.join('/'),
      loader: () => Promise.resolve(req(key)),
    })
  })
  return routeList
}

function getRouteList(Loading: any, navRouteMap: NavRouteMapType) {
  const routeList: RouteBaseProps[] = generateRouteList()

  const RouteList: any = []
  _.forEach(routeList, (v) => {
    if (navRouteMap[v.path]?.disabled) {
      return
    }
    const route = (
      <Route
        key={v.path}
        exact
        path={v.path}
        component={Loadable({
          loader: v.loader,
          loading: Loading,
        })}
      />
    )
    RouteList.push(route)
  })
  return RouteList
}

function getRedirect(navConfig: NavConfig) {
  const oneTwo: RedirectBaseProps[] = []
  _.each(navConfig, (one) => {
    if (one.sub?.length) {
      oneTwo.push({
        from: one.link,
        to: one.sub[0].link,
      })

      _.each(one.sub, (two) => {
        if (two.sub?.length) {
          oneTwo.push({
            from: two.link,
            to: two.sub[0].link,
          })
        }
      })
    }
  })

  return _.map(oneTwo, (v) => {
    return <Redirect key={v.from} exact from={v.from} to={v.to} />
  })
}

export interface AutoRouterProps {
  navConfig?: NavConfig
  navRouteMap?: NavRouteMapType
  NoMatch?: React.ComponentType<RouteComponentProps>
  Loading?: React.ComponentType<LoadingComponentProps>
  children?: React.ReactElement
}

/**
 * @pages/下三层目录
 */
const AutoRouter: FC<AutoRouterProps> = ({
  navConfig,
  NoMatch,
  Loading,
  children,
  navRouteMap = {},
}) => {
  // 优先用户的 children
  return (
    <Switch>
      {children}
      {navConfig && getRedirect(navConfig)}
      {getRouteList(Loading, navRouteMap)}
      <Route exact component={NoMatch} />
    </Switch>
  )
}

AutoRouter.defaultProps = {
  NoMatch: NoMatch,
  Loading: Loading,
}

export default memo(AutoRouter)
