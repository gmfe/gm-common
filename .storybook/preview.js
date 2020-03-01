import { addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'

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
