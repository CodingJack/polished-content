const path = require( 'path' );
const dir = path.resolve(__dirname, '');

module.exports = {
  overrideConfig: {
    env: {
      browser: true,
      es6: true,
    },
    plugins: [
      'react',
      'jsx-a11y',
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
    ],
    parser: '@babel/eslint-parser',
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 6,
      ecmaFeatures: {
        impliedStrict: true,
        jsx: true,
      },
      babelOptions: {
        configFile: `${ dir }/babel.config.js`,
      },
      requireConfigFile: false,
    },
    globals: {
      wp: 'readonly',
      ajaxurl: 'readonly',
      polishedContentGlobals: 'readonly',
      require: 'readonly',
      ReactDOM: 'readonly',
      __webpack_public_path__: 'writable',
    },
    parser: 'babel-eslint',
    parserOptions: {
      sourceType: 'module',
      ecmaFeatures: {
        ecmaVersion: 6,
        impliedStrict: true,
        jsx: true,
      },
    },
    rules: {
      'no-unused-vars': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'no-cond-assign': 'error',
      'no-template-curly-in-string': 'error',
      'no-eval': 'error',
      'no-floating-decimal': 'error',
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-lone-blocks': 'error',
      'no-multi-spaces': 'error',
      'no-multi-str': 'error',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-param-reassign': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-unmodified-loop-condition': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-useless-return': 'error',
      radix: 'error',
      yoda: 'error',
      'no-delete-var': 'error',
      'no-label-var': 'error',
      'react/prop-types': 0,
      'react/display-name': 0,
    },
  },
};
