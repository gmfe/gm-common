import json2020 from './data/2020.json'
import json2021 from './data/2021.json'
import moment from 'moment'
import _ from 'lodash'
import { DateType } from '../types'

interface Day {
  /** 日期 */
  date: string
  /** 节日名 */
  name: string
  /** 是否为休息日 */
  isOffDay: boolean
}

const days: Day[] = [...json2020.days, ...json2021.days]
const dayMap: { [key: string]: Day } = {}

_.each(days, (day) => {
  dayMap[day.date] = day
})

function getHoliday(date: DateType): Day | undefined {
  const dateStr = moment(date).format('YYYY-MM-DD')

  return dayMap[dateStr]
}

export default getHoliday
