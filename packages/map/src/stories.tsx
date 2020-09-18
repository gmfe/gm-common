import React from 'react'
import PcMap, { GetLocationParams } from './pc_map/pc_map'


export const PC_Map = () => {
  let position = { longitude: 113.943511, latitude: 22.548308 }
  let mapAddress = '广东省深圳市南山区粤海街道科兴科学园'
  const setLocation = (location: GetLocationParams) => {
    console.log('location', location)
  }
  return (
    <div style={{ width: '1000px', height: '500px' }}>
      <PcMap
        onGetLocation={setLocation}
        position={position}
        mapAddress={mapAddress}
        placeholder='请输入地址...'
      />
    </div>
  )
}

export default {
  title: 'Map',
}
