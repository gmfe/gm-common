import { useLocation } from 'react-router-dom'
import { parse } from 'query-string'
import type { Location } from 'history'

type GMLocation<Q, S> = Location<S> & {
  query: Q
}

function useGMLocation<Q = {}, S = {}>() {
  const location = useLocation() as GMLocation<Q, S>
  location.query = (parse(location.search) as unknown) as Q
  return location
}

export default useGMLocation
