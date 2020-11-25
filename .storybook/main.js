const _ = require('lodash')
const webpackFinal = (config) => {
  config.resolve.extensions = ['.tsx', '.ts', '.js', '.json']

  _.each(config.module.rules, (rule) => {
    if (rule.use && rule.use[0] && rule.use[0].loader) {
      if (rule.use[0].loader.includes('babel-loader')) {
        if (rule.include.push) rule.include.push(/gm-/)
        rule.exclude = function (filepath) {
          return filepath.includes('/node_modules/')
        }
      }
    }

    if (rule.loader && rule.loader.includes('file-loader')) {
      rule.test = /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|cur|ani|pdf)(\?.*)?$/
    }
  })
  config.module.rules.push({
    test: /stories\.tsx?$/,
    loaders: [
      {
        loader: require.resolve('@storybook/source-loader'),
        options: { parser: 'typescript' },
      },
    ],
    enforce: 'pre',
  })

  config.module.rules.push({
    test: /\.tsx?$/,
    use: [require.resolve('babel-loader')],
  })

  config.module.rules.push({
    test: /(glyphicons-halflings-regular|iconfont)\.(woff|woff2|ttf|eot|svg)($|\?)/,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'static/media/font/[name].[hash:8].[ext]',
        },
      },
    ],
  })

  config.module.rules.push({
    test: /\.less$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
      },
      {
        loader: 'less-loader',
      },
    ],
  })

  config.module.rules.unshift({
    test: /svg\/(\w|\W)+\.svg$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          icon: true,
          expandProps: 'start',
          svgProps: {
            fill: 'currentColor',
            className: "{'gm-svg-icon ' + (props.className || '')}",
          },
        },
      },
    ],
  })

  config.resolve.extensions.push('.ts', '.tsx')

  return config
}

module.exports = {
  addons: ['@storybook/addon-storysource'],
  stories: [
    '../packages/fingerprint/**/*stories.tsx',
    '../packages/locales/**/*stories.tsx',
    '../packages/number/**/*stories.tsx',
    '../packages/request/**/*stories.tsx',
    '../packages/x-request/**/*stories.tsx',
    '../packages/router/**/*stories.tsx',
    '../packages/tool/**/*stories.tsx',
    '../packages/wx-sdk/**/*stories.js',
    '../packages/analyse/**/*stories.tsx',
    '../packages/hooks/**/*stories.tsx',
    '../packages/image/**/*stories.tsx',
    '../packages/map/**/*stories.tsx',
    '../packages/graph/**/*stories.tsx',
    '../packages/date/**/*stories.tsx',
    '../demo/**/*stories.js',
  ],
  webpackFinal,
}
