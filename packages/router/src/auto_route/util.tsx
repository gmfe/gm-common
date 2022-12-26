import React, { FC, useEffect } from 'react'
import { LoadingComponentProps } from 'react-loadable'

const Loading: FC<LoadingComponentProps> = (props) => {
  const { retry, error } = props

  useEffect(()=>{
    if(error) console.error(error)
  },[])
  
  if (error) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '20px',
        }}
      >
        发生了错误！
        <button onClick={retry}>重试</button>
      </div>
    )
  } else {
    return <div className='text-center gm-padding-20'>加载中...</div>
  }
}

const NoMatch = () => {
  return <div>404</div>
}

export { Loading, NoMatch }
