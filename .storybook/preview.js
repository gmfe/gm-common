import { addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

// 构造 变量。 不知道怎么用 HtmlWebpackPlugin。于是就
window.__PRODUCTION__ = 'true'
window.__VERSION__ = '1.0.0'
window.__NAME__ = 'station'
window.__CLIENT_NAME__ = 'GmStation'
window.__COMMIT__ = 'none'
window.__BRANCH__ = 'none'

addDecorator(
  withInfo({
    inline: true,
    header: false,
    source: false,
    styles: stylesheet => {
      return {
        ...stylesheet,
        infoBody: {
          ...stylesheet.infoBody,
          borderTop: '1px solid #ccc',
          color: '#444',
          padding: '10px',
          fontWeight: 'normal'
        }
      }
    }
  })
)
