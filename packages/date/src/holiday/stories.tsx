import React from 'react'
import getHoliday from './index'
import moment from 'moment'
import _ from 'lodash'
import { Flex } from '@gm-pc/react'

export const ComHoliday = () => {
  const begin = moment(new Date('2020-09-26'))

  return (
    <Flex wrap style={{ width: '700px' }}>
      {_.map(_.range(30), (i) => {
        begin.add('d', 1)

        const holiday = getHoliday(begin.toDate())

        return (
          <Flex
            column
            alignCenter
            key={i}
            style={{ width: '100px', height: '50px' }}
            className='gm-position-relative'
          >
            <div style={{ fontSize: '20px' }}>{begin.format('DD')}</div>
            {holiday && holiday.isOffDay && (
              <div className='gm-text-success'>{holiday.name}</div>
            )}
            {holiday && holiday.isOffDay === false && (
              <div className='gm-text-red'>班</div>
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}

export default {
  title: 'Date/Holiday',
}
