import _ from 'lodash'
import { url, RecommendList } from './gm_map'
const getTips = async (
  value: string,
  amapkey: string,
): Promise<RecommendList[]> => {
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
    return recommendList
  }
  return []
}
export { getTips }
