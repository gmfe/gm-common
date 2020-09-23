import React from 'react'
import { GMMap, GMMapLocationParams } from './index'

export const Map = () => {
  let location = { longitude: 113.943511, latitude: 22.548308, address: '广东省深圳市南山区粤海街道科兴科学园' }
  const setLocation = (location: GMMapLocationParams) => {
    console.log('location', location)
  }
  return (
    <div style={{ width: '1000px', height: '500px' }}>
      <GMMap
        onLocation={setLocation}
        location={location}
        placeholder='请输入地址...'
      />
    </div>
  )
}

export default {
  title: 'Map',
}
