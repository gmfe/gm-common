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

// src/pages index.page.xxx
const req = require.context('@/pages', true, /index\.page\./, 'lazy')

function getRouteList(Loading: any) {
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

  const RouteList = _.map(routeList, (v) => {
    return (
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
}) => {
  // 优先用户的 children
  return (
    <Switch>
      {children}
      {navConfig && getRedirect(navConfig)}
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
