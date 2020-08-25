import React from 'react'
import {
  Request,
  configError,
  configHeaders,
  configAuth,
  configGrpcCodes
} from './index'

import type { ResponseBase } from './index'

interface Response extends ResponseBase {
  role: any
}

configAuth('/enterprise/CreateRole', 'role.name')
configGrpcCodes({ '3': '参数错误' })
configError((message, response) => {
  console.log(message, response)
})
configHeaders()

export const normal = () => {
  return (
    <div>
      <button
        onClick={() => {
          Request<Response>('/enterprise/CreateRole')
            .code([3])
            .json({
                role:{
                  name: 'my_first_group',
                  // role_id: '1'
                }
            })
            .post()
            .then((json) => {
              console.log(json.gRPCStatus, json.gRPCMessage, json.role)
            })
            .catch((error) => {
              console.log(error)
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
