import React, {
  useRef,
  FC,
  useState,
  ChangeEvent,
  useCallback,
  useEffect,
} from 'react'
import { Map, Marker, EventMap, LngLatPos } from 'react-amap'
import _ from 'lodash'
import classNames from 'classnames'
import SvgClose from '../svg/close.svg'
import { getMapTips, getMapCenterAddress } from './util'
import type { tipsArray } from './util'

const baseUrl = 'https://restapi.amap.com/v3/'

interface LocationMapProps {
  onLocation(location: LocationParams): void
  location?: LocationParams
  defaultLocation?: LocationParams
  amapkey?: string
  zoom?: number
  placeholder?: string
}

interface LocationParams {
  longitude: string | number
  latitude: string | number
  address?: string
}

const LocationMap: FC<LocationMapProps> = (props) => {
  const { placeholder, zoom, amapkey, onLocation, defaultLocation } = props
  const lngAndLat: LocationParams = {
    longitude: defaultLocation?.longitude || 113.943511,
    latitude: defaultLocation?.latitude || 22.548308,
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<object | null>(null)
  const [center, setCenter] = useState<LocationParams>(lngAndLat)
  const [tips, setTips] = useState<tipsArray[]>([])
  const [mask, setMask] = useState<boolean>(true)
  const [inputFocus, setInputFocus] = useState<boolean>(false)
  const [keywords, setKeywords] = useState<string>(
    defaultLocation?.address || '',
  )
  const mapEvents: EventMap = {
    created: (m: object | null): void => {
      mapRef.current = m
    },
  }
  useEffect(() => {
    setCenter(lngAndLat)
    setKeywords(defaultLocation?.address || '')
  }, [defaultLocation])

  // fetchCenter
  const fetchMapCenter = async (center: LngLatPos) => {
    const keywords = await getMapCenterAddress(
      baseUrl,
      `geocode/regeo?key=${amapkey}&location=${center.lng},${center.lat}`,
    )
    setKeywords(keywords)
    getTips(keywords)
    onLocation({
      longitude: center.lng,
      latitude: center.lat,
      address: keywords,
    })
  }

  const getTips = async (value: string): Promise<void> => {
    const tips = await getMapTips(
      baseUrl,
      `assistant/inputtips?key=${amapkey}&keywords=${value}`,
    )
    setTips(tips)
  }

  const handleEventAction = () => {
    const center = mapRef.current!.getCenter()
    fetchMapCenter(center)
    setCenter({
      longitude: center.lng,
      latitude: center.lat,
    })
  }

  const handleTipsClick = (item: tipsArray) => {
    const [longitude, latitude] = item.location.split(',')
    // tip接口拿到的经纬度是string，
    const location = {
      longitude: Number(longitude),
      latitude: Number(latitude),
    }
    const address = `${item.district}${item.name}`
    setCenter(location)
    setKeywords(address)
    setTips([])
    onLocation({
      ...location,
      address,
    })
  }

  const handleInputChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setKeywords(value)
      getTips(keywords)
    },
    [setKeywords, getTips],
  )

  const handleCleanKeywords = useCallback(() => {
    setKeywords('')
    setTips([])
  }, [])

  const handleInputBlur = useCallback(() => {
    setInputFocus(false)
  }, [])

  const handleInputFocus = useCallback(() => {
    setInputFocus(true)
    setMask(false)
  }, [])

  const mapCenter = { center }
  const markerCenter = { position: center }

  return (
    <div className='c-location-map'>
      <div className='c-location-map-input-wrap'>
        <input
          className={classNames('c-location-map-input', {
            'c-location-map-input-focus': inputFocus,
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
          <SvgClose
            onClick={handleCleanKeywords}
            className='c-location-map-icon'
          />
        ) : null}
      </div>
      <div
        className='c-location-map-amap'
        onTouchEnd={handleEventAction}
        onMouseUp={handleEventAction}
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
      {tips.length ? (
        <ul className='c-location-map-result'>
          {_.map(tips, (item) => {
            return (
              <li
                className='c-location-map-result-item'
                onClick={() => handleTipsClick(item)}
                key={`${item.district}${item.name}`}
              >
                <div className='c-location-map-result-name'>{item.name}</div>
                <div className='c-location-map-result-district'>{`${item.district}${item.address}`}</div>
              </li>
            )
          })}
        </ul>
      ) : null}
      {!center ? (
        <div className='c-location-map-warning'>
          当前地址信息无法获取位置，请重新输入地址或拖动地图至正确位置保存
        </div>
      ) : null}
      {mask ? (
        <div className='c-location-map-mask' onClick={() => setMask(false)}>
          <div className='c-location-map-mask-tip'>点击解锁后，可拖动修改</div>
        </div>
      ) : null}
    </div>
  )
}
LocationMap.defaultProps = {
  // zoom 表示地图显示的缩放级别。在PC上，取值范围为[3-18]。在移动设备上,取值范围[3-19]。
  zoom: 16,
  // 高德地图的key
  amapkey: '0ad6fc3840dcb69ead7807ddbc02e6a2',
}

export type { LocationMapProps, LocationParams }

export default LocationMap
