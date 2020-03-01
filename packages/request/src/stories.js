import React from 'react'
import Request from './'


const normal = () => {
  return (
    <div>
      <button onClick={() => {
        Request
      }}>request</button>
    </div>
  )
}

export default {
  title: 'Request|Request'
}
