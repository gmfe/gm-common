import React from 'react'
import Fingerprint2 from 'fingerprintjs2'
import UUID from './uuid'
import md5 from './md5'

const d = new Date()
Fingerprint2.get(components => {
  console.log(components)
  const id = Fingerprint2.x64hash128(components.map(v => v.value).join(''), 31)
  console.log(id)

  console.log(new Date() - d)
})
console.log('out', new Date() - d)

const dd = new Date()
md5(UUID.generate())
console.log(new Date() - dd)

export const demo = () => {
  return <div>demo</div>
}

export default {
  title: 'DEMO|DEMO'
}
