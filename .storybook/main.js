const webpackFinal = (config) => {
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
    '../demo/**/*stories.js',
  ],
  webpackFinal,
}
