import React from 'react'
import { GLocationMap } from './index'

export const GLocation_Map = () => {
  let location = {
    lng: '',
    lat: '',
    address: '广东省深圳市南山区粤海街道科兴科学园',
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <GLocationMap
        placeholder='请输入地址'
        defaultLocation={location}
        onLocation={(res) => {
          console.log(res)
        }}
      />
    </div>
  )
}

export default {
  title: 'GLocationMap',
}
