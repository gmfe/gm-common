import React, { useState } from 'react'
import Storage from '../packages/tool/src/storage'

const key = 'input'

export const Demo = () => {
  const [value, setValue] = useState(Storage.get(key) || '')

  return (
    <div>
      <input
        type='text'
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          Storage.set(key, e.target.value)
        }}
      />
    </div>
  )
}

export default {
  title: 'DEMO|DEMO',
}
