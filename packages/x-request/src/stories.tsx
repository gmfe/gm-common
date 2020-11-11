import React from 'react'
import { Request, configError, configHeaders, initAuth } from './index'
// @ts-ignore
import sha256 from 'crypto-js/sha256'

initAuth('/enterprise/CreateRole', 'role.name')
configError((message, response) => {
  console.log(message, response)
})
configHeaders()

export const normal = () => {
  return (
    <div>
      <button
        onClick={() => {
          Request<{ role: any }>('/enterprise/CreateRole')
            .code([3])
            .data({
              role: {
                name: 'my_first_group',
                // role_id: '1'
              },
            })
            .run()
            .then(
              (json) => {
                console.log('resolve', json)
              },
              (reason) => {
                console.log('reject', reason)
              },
            )
        }}
      >
        request post
      </button>
      <br />
    </div>
  )
}

export const login = () => {
  return (
    <div>
      <button
        onClick={() => {
          Request('/ceres/oauth/OAuthService/Token')
            .data({
              grant_type: 'password',
              username: 'admin',
              group_id: '326311583942705176',
              password: sha256('123456').toString(),
              client_id: '1',
            })
            .run()
        }}
      >
        login
      </button>
    </div>
  )
}

export default {
  title: 'xRequest/xRequest',
}
