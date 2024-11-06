module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'testing-library/no-container': 'error',
    'testing-library/no-debugging-utils': 'warn'
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src/']
      }
    }
  }
};