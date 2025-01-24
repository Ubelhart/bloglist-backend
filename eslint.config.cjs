const globals = require('globals')

module.exports = [
  {
    languageOptions:{
      ecmaVersion:'latest',
      sourceType:'script',
      globals:{
        browser:'readonly',
        es2020:'readonly',
        commonjs:'readonly',
      },
    },
    rules:{
      strict:off,
      indent:['error', 2],
      'linebreak-style':['error', 'windows'],
      quotes:['error', 'single'],
      semi:['error', 'never'],
      eqeqeq:'error',
      'no-trailing-spaces':'error',
      'object-curly-spacing':['error', 'always'],
      'arrow-spacing':['error', { before:true, after:true }],
      'no-console':0,
      'no-unused-vars':0,
    },
    ignores:['dist', 'eslint.config.cjs'],
  },
  {
    files:['**/*.js'],
    languageOptions:{
      sourceType:'commonjs',
      globals:globals.node,
    },
    rules:{
      'strict':['error', 'global'],
      'no-var':'error',
      'prefer-const':'error',
      'no-unused-vars':'error',
    },
  },
]