import React, { FC } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'
import _ from 'lodash'

interface Obj {
  path?: string
  loader?: any
  from?: string
  to?: string
}

// obj 应该分为两个才对

// interface RouteObj {
//   path: string
//   loader(): any
// }
//
// interface RedirectObj {
//   from: string
//   to: string
// }

const Loading = (props: any) => {
  const { retry, error } = props
  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
        }}
      >
        发生了错误！
        <button onClick={retry}>重试</button>
      </div>
    )
  } else {
    return <div className='text-center gm-padding-20'>加载中...</div>
  }
}

const NoMatch = () => {
  return <div>404</div>
}

function getRoute(params: Obj) {
  const { path, loader } = params
  return (
    <Route
      key={path}
      exact
      path={path}
      component={Loadable({
        loader,
        loading: Loading,
      })}
    />
  )
}

function getRedirect(params: Obj) {
  const { from, to } = params
  // @ts-ignore
  return <Redirect key={from} exact from={from} to={to} />
}

// index.page.xxx
const req = require.context('@/pages', true, /index\.page\./, 'lazy')

const routeList: Obj[] = []

// redirect from 去重，只需要一个即可
const fromMap: any = {}
function pushRedirect(what: Obj) {
  const { from } = what

  // @ts-ignore
  if (!fromMap[from]) {
    routeList.push(what)

    // @ts-ignore
    fromMap[from] = true
  }
}

_.each(req.keys(), (key) => {
  // ./home/index.page.xxx => /home

  // slice(1) 去掉 .
  // slice(0, -1) 去掉 index.page.xxx
  // 剩下就是路由部分
  const pathArr = key.slice(1).split('/').slice(0, -1)

  // 最多三个层级
  // /a        /a
  // /a/b      /a->/a/b /a/b
  // /a/b/c    /a->/a/b /a/b->/a/b/c /a/b/c
  // /a/b/c/d  /a/b/c/d

  // 实现的很挫

  if (pathArr.length === 3) {
    pushRedirect({
      from: pathArr.slice(0, 2).join('/'),
      to: pathArr.slice(0, 3).join('/'),
    })
  }

  if (pathArr.length === 4) {
    pushRedirect({
      from: pathArr.slice(0, 2).join('/'),
      to: pathArr.slice(0, 3).join('/'),
    })
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

const RouteList = _.map(routeList, (v: Obj) => {
  if (v.from) {
    return getRedirect(v)
  }
  return getRoute(v)
})

interface AutoRouterProps {
  NoMatch?: any
  Loading?: any
}

const AutoRouter: FC<AutoRouterProps> = ({ NoMatch, children }) => {
  // 优先用户的 children
  return (
    <Switch>
      {children}
      {RouteList}
      <Route exact component={() => <NoMatch />} />
    </Switch>
  )
}

AutoRouter.defaultProps = {
  NoMatch: NoMatch,
  Loading: Loading,
}

export default React.memo(AutoRouter)
