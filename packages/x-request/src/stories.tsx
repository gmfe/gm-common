import React from 'react'
import {
  Request,
  configError,
  configHeaders,
  initAuth,
  initGRpcCodes
} from './index'

initAuth('/enterprise/CreateRole', 'role.name')
initGRpcCodes({ '3': '参数错误' })
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
                role:{
                  name: 'my_first_group',
                  // role_id: '1'
                }
            })
            .run()
            .then((json) => {
              console.log(json)
            })
        }}
      >
        request post
      </button>
      <br />
    </div>
  )
}

export default {
  title: 'xRequest/xRequest',
}
