import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  ChangeEvent,
} from 'react'
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Autocomplete,
} from '@react-google-maps/api'
import classNames from 'classnames'
import SvgClose from '../svg/close.svg'

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
  const autoComplateRef = useRef<any>(null)

  const [center, setCenter] = useState<GLocationData>(lngAndLat)
  const [inputFocus, setInputFocus] = useState<boolean>(false)
  const [keywords, setKeywords] = useState<string>(
    defaultLocation?.address || '',
  )
  const [mask, setMask] = useState<boolean>(true)

  useEffect(() => {
    setCenter(lngAndLat)
    setKeywords(defaultLocation?.address || '')
  }, [defaultLocation])

  const onMapLoad = useCallback((map: any) => {
    mapRef.current = map
  }, [])

  const onAutoCompleteMapLoad = useCallback((c: any) => {
    autoComplateRef.current = c
  }, [])

  const handleCleanKeywords = useCallback(() => {
    setKeywords('')
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
  }, [])

  const onPlaceChanged = () => {
    if (autoComplateRef.current) {
      const place = autoComplateRef.current.getPlace()
      if (place && place.geometry) {
        const location = place.geometry.location.toJSON()
        setCenter(location)
        setKeywords(place.formatted_address)
        onLocation({
          ...location,
          address: place.formatted_address,
        })
      }
    }
  }

  const handleMapDragEng = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter()
      const geocoder = new (window as any).google.maps.Geocoder()
      geocoder.geocode({ location: center }, (res: any[], status: any) => {
        if (status === 'OK' && res.length) {
          setCenter(center)
          setKeywords(res[0].formatted_address)
          onLocation({
            ...center.toJSON(),
            address: res[0].formatted_address,
          })
        }
      })
    }
  }

  return (
    <div className='c-g-location-map'>
      <div className='c-g-location-map-gmap'>
        {isLoaded ? (
          <GoogleMap
            zoom={zoom}
            center={center}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onLoad={onMapLoad}
            onDragEnd={handleMapDragEng}
          >
            <Autocomplete
              fields={['geometry', 'name', 'formatted_address']}
              onLoad={onAutoCompleteMapLoad}
              onPlaceChanged={onPlaceChanged}
            >
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
            </Autocomplete>
            <Marker position={center} />
          </GoogleMap>
        ) : (
          <div>Map loading...</div>
        )}
      </div>

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

export type { GLocationData, GLocationMapProps }

export default GLocationMap
