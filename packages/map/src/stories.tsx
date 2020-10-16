import React from 'react'
import { LocationMap, LocationData } from './index'

export const Location_Map = () => {
  let location = { longitude: '', latitude: '', address: '广东省深圳市南山区粤海街道科兴科学园' }
  const setLocation = (location: LocationData) => {
    console.log('location', location)
  }
  return (
    <div style={{ width: '1000px', height: '500px' }}>
      <LocationMap
        onLocation={setLocation}
        defaultLocation={location}
        placeholder='请输入地址...'
      />
    </div>
  )
}

export default {
  title: 'LocationMap',
}
