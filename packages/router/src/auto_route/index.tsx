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

// src/pages index.page.xxx
const req = require.context('@/pages', true, /index\.page\./, 'lazy')

function getRouteList(Loading: any) {
  const routeList: (RouteBaseProps | RedirectBaseProps)[] = []

  // redirect from 去重，只需要一个即可
  const fromMap: { [key: string]: any } = {}

  function pushRedirect(what: RedirectBaseProps) {
    const from = what.from as string

    if (!fromMap[from]) {
      routeList.push(what)

      fromMap[from] = true
    }
  }

  _.each(req.keys(), (key) => {
    // ./home/index.page.xxx => /home

    // slice(1) 去掉 .
    // slice(0, -1) 去掉 index.page.xxx
    // 剩下就是路由部分
    const pathArr = key.slice(1).split('/').slice(0, -1)

    // 业务最多三个层级，更深的是业务具体的页面
    // 只有 2 3 层级需要 redirect
    // /a        /a
    // /a/b      /a->/a/b /a/b
    // /a/b/c    /a->/a/b /a/b->/a/b/c /a/b/c
    // /a/b/c/d  /a/b/c/d

    if (pathArr.length === 3) {
      // 一级跳二级
      pushRedirect({
        from: pathArr.slice(0, 2).join('/'),
        to: pathArr.slice(0, 3).join('/'),
      })
    }

    if (pathArr.length === 4) {
      // 一级跳二级
      pushRedirect({
        from: pathArr.slice(0, 2).join('/'),
        to: pathArr.slice(0, 3).join('/'),
      })
      // 二级跳三级
      pushRedirect({
        from: pathArr.slice(0, 3).join('/'),
        to: pathArr.slice(0, 4).join('/'),
      })
    }

    routeList.push({
      path: pathArr.join('/'),
      loader: () => Promise.resolve(req(key)),
    })
  })

  const RouteList = _.map(routeList, (v) => {
    const redirect = v as RedirectBaseProps
    if (redirect.from) {
      return (
        <Redirect
          key={redirect.from}
          exact
          from={redirect.from}
          to={redirect.to}
        />
      )
    }

    const route = v as RouteBaseProps
    return (
      <Route
        key={route.path}
        exact
        path={route.path}
        component={Loadable({
          loader: route.loader,
          loading: Loading,
        })}
      />
    )
  })

  return RouteList
}

export interface AutoRouterProps {
  NoMatch?: React.ComponentType<RouteComponentProps>
  Loading?: React.ComponentType<LoadingComponentProps>
}

const AutoRouter: FC<AutoRouterProps> = ({ NoMatch, Loading, children }) => {
  // 优先用户的 children
  return (
    <Switch>
      {children}
      {getRouteList(Loading)}
      <Route exact component={NoMatch} />
    </Switch>
  )
}

AutoRouter.defaultProps = {
  NoMatch: NoMatch,
  Loading: Loading,
}

export default memo(AutoRouter)
