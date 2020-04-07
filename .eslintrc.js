module.exports = {
  extends: ['plugin:gm-react-app/recommended'],
  rules: {
    'import/extensions': [
      2,
      'ignorePackages',
      { ts: 'never', tsx: 'never', json: 'always', js: 'never' }
    ],
    'no-undef': 0
  }
}
