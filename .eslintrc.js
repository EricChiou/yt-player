module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'linebreak-style': ['off'],
    'comma-dangle': ['off'],
    'max-len': ['error', { 'code': 140 }],
    'arrow-parens': ['off'],
    'no-param-reassign': ['error', { 'props': false }],
    'operator-linebreak': ['error', 'after'],
    'semi': ['error', 'always'],
    'no-extra-semi': 'error',
    'quotes': ['error', 'single'],
    'space-before-function-paren': ['error', 'never']
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
