import React from 'react'
import { Request, configTrace, configHeaders } from './'

configTrace()
configHeaders()

export const normal = () => {
  return (
    <div>
      <button
        onClick={() => {
          Request('https://www.google.com')
            .data({
              id: 1
            })
            .get()
            .then(json => {
              console.log(json)
            })
            .catch(error => {
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
              name: '你好啊'
            })
            .post()
            .then(json => {
              console.log(json)
            })
            .catch(error => {
              console.log(error)
            })
        }}
      >
        request post
      </button>
      <br />
      <input
        type='file'
        onChange={e => {
          const file = e.target.files[0]
          Request('/asdfas', {
            file
          })
            .post()
            .then(json => {
              console.log(json)
            })
            .catch(error => {
              console.log(error)
            })
        }}
      />
    </div>
  )
}

export default {
  title: 'Request|Request'
}
