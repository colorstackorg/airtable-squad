module.exports = {
  env: { browser: true, es6: true },
  extends: ['rami'],
  globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
  rules: { 'no-continue': 'off', 'react/prop-types': 'off' }
};
