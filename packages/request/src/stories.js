import React from 'react'
import { Request } from './'

export const normal = () => {
  return (
    <div>
      <button
        onClick={() => {
          Request('/adfasdf')
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
    </div>
  )
}

export default {
  title: 'Request|Request'
}
