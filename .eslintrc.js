module.exports = {
  root: true,
  env: {
    commonjs: true,
    browser: true,
    es6: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['prettier'],
  rules: {
    'no-console': [
      'error', // will not allow the console.log
      {
        allow: ['warn', 'error', 'info'],
      },
    ],
    'prettier/prettier': 'error',
    'no-eval': 'error',
    'import/first': 'error',
    'consistent-return': [0, { treatUndefinedAsUnspecified: true }],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
};
