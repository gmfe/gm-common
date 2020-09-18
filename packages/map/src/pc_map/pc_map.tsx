import React, { useRef, FC, useState, ChangeEvent, useCallback } from 'react'
import { Map, Marker, EventMap } from 'react-amap'
import _ from 'lodash'
import classNames from 'classnames'
import SvgClose from '../svg/close.svg'
import './map.less'

const url = 'https://restapi.amap.com/v3/assistant/inputtips'
const urlRegeo = 'https://restapi.amap.com/v3/geocode/regeo'

interface PcMapProps {
  mapAddress: string
  onGetLocation(location: GetLocationParams): void
  position: CenterState
  amapkey?: string
  zoom?: number
  placeholder?: string
}
// 因为高德不同的接口拉出来的的经纬度有string和number两种类型
interface CenterState {
  longitude: number
  latitude: number
}

interface RecommendList {
  [key: string]: string
}

export interface GetLocationParams extends CenterState {
  address: string
}

const PcMap: FC<PcMapProps> = (props) => {
  const {
    placeholder,
    zoom,
    amapkey,
    mapAddress,
    onGetLocation,
    position,
  } = props
  const inputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<object | null>(null)
  const [center, setCenter] = useState<CenterState | null>(position)
  const [recommendList, setRecommendList] = useState<RecommendList[]>([])
  const [mask, setMask] = useState<boolean>(true)
  const [showList, setShowList] = useState<boolean>(false)
  const [inputFocus, setInputFocus] = useState<boolean>(false)
  const [keywords, setKeywords] = useState<string>(mapAddress)
  const mapEvents: EventMap = {
    created: (m: object | null): void => {
      mapRef.current = m
    },
  }

  const getTips = async (value: string): Promise<void> => {
    const data = await window
      .fetch(`${url}?key=${amapkey}&keywords=${value}`)
      .then((res) => res.json())
      .catch((err) => {
        console.error(err)
      })
    if (data.status === '1') {
      // 过滤掉不合法的item
      const recommendList = _.filter(
        data.tips,
        (item) => typeof item.id === 'string',
      )
      setRecommendList(recommendList)
    }
  }
  const handleMapMove = async (center: { lng: number; lat: number }) => {
    const data = await window
      .fetch(`${urlRegeo}?key=${amapkey}&location=${center.lng},${center.lat}`)
      .then((res) => res.json())
      .catch((err) => {
        console.error(err)
      })
    if (data.status === '1') {
      const keywords: string = data.regeocode.formatted_address
      setKeywords(keywords)
      debounceGetTips(keywords)
      onGetLocation({
        longitude: center.lng,
        latitude: center.lat,
        address: keywords,
      })
    }
  }

  const debounceHandleMapMove = _.debounce(handleMapMove, 100)
  const debounceGetTips = _.debounce(getTips, 100)
  const handleCenter = () => {
    const center = mapRef.current!.getCenter()
    debounceHandleMapMove(center)
    setCenter({
      longitude: center.lng,
      latitude: center.lat,
    })
  }

  const handleTipsClick = (item: { [key: string]: string }) => {
    const [longitude, latitude] = item.location.split(',')
    // tip接口拿到的经纬度是string，
    const location = {
      longitude: Number(longitude),
      latitude: Number(latitude),
    }
    const address = `${item.district}${item.name}`
    setCenter(location)
    setKeywords(address)
    setShowList(false)
    onGetLocation({
      ...location,
      address: keywords,
    })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeywords(value)
    debounceGetTips(value)
  }

  const handleCleanKeywords = useCallback(() => {
    setKeywords('')
  }, [])

  const handleInputBlur = useCallback(() => {
    setInputFocus(false)
  }, [])

  const handleInputFocus = useCallback(() => {
    setShowList(true)
    setInputFocus(true)
    setMask(false)
  }, [])

  const mapCenter = center ? { center } : {}
  const markerCenter = center ? { position: center } : {}

  return (
    <div className='gm-map'>
      <div className='gm-map-input-wrap'>
        <input
          className={classNames('gm-map-input', {
            'gm-map-input-focus': inputFocus,
          })}
          type='text'
          placeholder={placeholder}
          value={keywords}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          ref={inputRef}
        />
        {keywords && keywords.length ? (
          <SvgClose onClick={handleCleanKeywords} className='gm-map-icon' />
        ) : null}
      </div>
      <div
        className='gm-map-amap'
        onTouchEnd={handleCenter}
        onMouseUp={handleCenter}
      >
        <Map
          version='1.4.6'
          zoom={zoom}
          {...mapCenter}
          events={mapEvents}
          amapkey={amapkey}
        >
          <Marker {...markerCenter} />
        </Map>
      </div>
      {showList && recommendList.length ? (
        <ul className='gm-map-result'>
          {_.map(recommendList, (item) => {
            return (
              <li
                className='gm-map-result-item'
                onClick={() => handleTipsClick(item)}
                key={`${item.district}${item.name}`}
              >
                <div className='gm-map-result-name'>{item.name}</div>
                <div className='gm-map-result-district'>{`${item.district}${item.address}`}</div>
              </li>
            )
          })}
        </ul>
      ) : null}
      {!center ? (
        <div className='gm-map-warning'>
          当前地址信息无法获取位置，请重新输入地址或拖动地图至正确位置保存
        </div>
      ) : null}
      {mask ? (
        <div className='gm-map-mask' onClick={() => setMask(false)}>
          <div className='gm-map-mask-tip'>点击解锁后，可拖动修改</div>
        </div>
      ) : null}
    </div>
  )
}
PcMap.defaultProps = {
  // zoom 表示地图显示的缩放级别。在PC上，取值范围为[3-18]。在移动设备上,取值范围[3-19]。
  zoom: 16,
  // 高德地图的key
  amapkey: 'e805d5ba2ef44393f20bc9176c3821a2',
}

export default PcMap
