import React from 'react'
import {
  instance,
  Request,
  configTrace,
  configHeaders,
} from './index'

configTrace()
configHeaders()

instance.interceptors.response.use(
  (response) => {
    console.log(response)
    return response
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  },
)

export const normal = () => {
  return (
    <div>
      <button
        onClick={() => {
          Request<any>('http://dev.guanmai.cn:8811/enterprise/CreateRole')
            .code([0, 10])
            .data({
                role: JSON.stringify({
                    name: "my_first_group"
                })
            })
            .post()
            .then((json) => {
              console.log(json)
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
