import js from '@eslint/js';
import reactRefresh from 'eslint-plugin-react-refresh';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
  // Keep configs minimal; skip linting built files
  {
    ignores: ['dist/**'],
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { document: 'readonly', window: 'readonly', localStorage: 'readonly', navigator: 'readonly' }
    },
    plugins: { 'react-refresh': reactRefresh, 'react-hooks': reactHooks },
    rules: {
      'no-prototype-builtins': 'off',
      'no-misleading-character-class': 'off',
      'no-useless-escape': 'off',
      'no-cond-assign': 'off',
      'no-empty': 'off',
      'getter-return': 'off',
      'valid-typeof': 'off',
      'no-fallthrough': 'off',
      'no-control-regex': 'off',
      'no-constant-condition': 'off',
      'no-func-assign': 'off',
      'no-case-declarations': 'off',
      'no-self-assign': 'off',
      'react-refresh/only-export-components': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off'
    }
  }
];
