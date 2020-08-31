import { useLocation } from 'react-router-dom'
import { parse } from 'query-string'

function useQuery<P = {}>() {
  const location = useLocation()
  return (parse(location.search) as unknown) as P
}

export default useQuery
