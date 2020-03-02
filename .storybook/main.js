const webpackFinal = config => {
  config.module.rules.push({
    test: /\.stories\.jsx?$/,
    loaders: [require.resolve('@storybook/source-loader')],
    enforce: 'pre'
  })

  return config
}

module.exports = {
  addons: ['@storybook/addon-storysource/register'],
  stories: ['../packages/**/*stories.js', '../demo/**/*.stories.js'],
  webpackFinal
}
