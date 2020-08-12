import React from 'react'
import {
  instance,
  Request,
  configTrace,
  configHeaders,
  configRetry,
} from './index'

configTrace()
configHeaders()
configRetry()

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
          Request('https://www.google.com')
            .code([0, 10])
            .data({
              id: 1,
              age: null,
              address: undefined,
            })
            .get()
            .then((json) => {
              console.log(json)
            })
            .catch((error) => {
              console.log(error)
            })
        }}
      >
        request get
      </button>
      <br />
      <button
        onClick={() => {
          Request('/afas')
            .data({
              id: 1,
              name: '你好啊',
              age: null,
              address: undefined,
            })
            .code(2)
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
      <input
        type='file'
        onChange={(e) => {
          const file = e.target.files?.[0]
          Request('/asdfas')
            .data({
              file,
            })
            .post()
            .then((json) => {
              console.log(json)
            })
            .catch((error) => {
              console.log(error)
            })
        }}
      />
    </div>
  )
}

export default {
  title: 'Request/Request',
}
