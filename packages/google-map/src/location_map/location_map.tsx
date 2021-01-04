import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
} from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import classNames from 'classnames'
import SvgClose from '../svg/close.svg'
import _ from 'lodash'

interface GLocationData {
  lat?: number
  lng?: number
  address?: string
}

interface GLocationMapProps {
  zoom?: number
  googleApiKey?: string
  placeholder?: string
  defaultLocation?: GLocationData
  onLocation(location: GLocationData): void
}

// 不要每次都传新的，会导致重复加载 JS
const libraries: any[] = ['places']

const GLocationMap: FC<GLocationMapProps> = ({
  placeholder,
  googleApiKey = 'AIzaSyBcNtmptbXNIDlq0CZuSHh_SH7WYYUeaFE',
  zoom = 16,
  defaultLocation,
  onLocation,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
    libraries,
  })

  const lngAndLat: GLocationData = {
    lng: defaultLocation?.lng || 113.9402776,
    lat: defaultLocation?.lat || 22.551669399999998,
  }

  const inputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<any>(null)
  const debounceSearchRef = useRef<any>(null)

  const [center, setCenter] = useState<GLocationData>(lngAndLat)
  const [tips, setTips] = useState<any[]>([])
  const [inputFocus, setInputFocus] = useState<boolean>(false)
  const [keywords, setKeywords] = useState<string>(
    defaultLocation?.address || '',
  )
  const [mask, setMask] = useState<boolean>(true)

  useEffect(() => {
    debounceSearchRef.current = _.debounce(searchKeywords, 500)
  }, [])

  useEffect(() => {
    setCenter(lngAndLat)
    setKeywords(defaultLocation?.address || '')
  }, [defaultLocation])

  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map
  }, [])

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

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setKeywords(value)
    debounceSearchRef.current(value)
  }, [])

  const searchKeywords = (keywords: string) => {
    if (!keywords) {
      return
    }
    const service = new (window as any).google.maps.places.PlacesService(
      mapRef.current,
    )
    service.textSearch(
      {
        query: keywords,
      },
      (res: any[], status: string) => {
        if (status === 'OK') {
          setTips(res)
        }
      },
    )
  }

  const handlePlaceChanged = (place: any) => {
    setTips([])
    const location = place.geometry.location.toJSON()
    setCenter(location)
    setKeywords(`${place.name} ${place.formatted_address || place.vicinity}`)
    onLocation({
      ...location,
      address: `${place.name} ${place.formatted_address || place.vicinity}`,
    })
  }

  const handleMapDragEng = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter()
      setCenter(center)
      const geocoder = new (window as any).google.maps.Geocoder()
      geocoder.geocode({ location: center }, (res: any[], status: any) => {
        if (status === 'OK' && res.length) {
          setCenter(center)
          setKeywords(res[0].formatted_address)
        }
      })

      const service = new (window as any).google.maps.places.PlacesService(
        mapRef.current,
      )
      service.nearbySearch(
        {
          location: center,
          radius: 100,
        },
        (res: any, status: any) => {
          if (status === 'OK') {
            setTips(res)
          }
        },
      )
    }
  }

  const handleMapClick = () => {
    setTips([])
  }

  return (
    <div className='c-g-location-map'>
      <div className='c-g-location-map-input-wrap'>
        <input
          className={classNames('c-g-location-map-input', {
            'c-g-location-map-input-focus': inputFocus,
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
            className='c-g-location-map-icon'
          />
        ) : null}
      </div>

      <div className='c-g-location-map-gmap'>
        {isLoaded ? (
          <GoogleMap
            zoom={zoom}
            center={center}
            onClick={handleMapClick}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onLoad={onMapLoad}
            onDragEnd={handleMapDragEng}
          >
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <div>Map loading...</div>
        )}
      </div>

      {!!tips.length && (
        <ul className='c-g-location-map-result'>
          {_.map(tips, (tip) => {
            return (
              <li
                className='c-g-location-map-result-item'
                key={tip.place_id}
                onClick={() => handlePlaceChanged(tip)}
              >
                <div>{tip.name}</div>
                <div>{tip.formatted_address || tip.vicinity}</div>
              </li>
            )
          })}
        </ul>
      )}

      {mask && isLoaded ? (
        <div className='c-g-location-map-mask' onClick={() => setMask(false)}>
          <div className='c-g-location-map-mask-tip'>
            点击解锁后，可拖动修改
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default GLocationMap
