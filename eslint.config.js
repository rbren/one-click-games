import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['dist', 'node_modules'], languageOptions: { globals: { console: 'readonly' } } },
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { console: 'readonly' }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...tsPlugin.configs.recommended.rules
    }
  },
  prettier
,
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { describe: 'readonly', it: 'readonly', expect: 'readonly', vi: 'readonly', console: 'readonly' }
    },
    plugins: { '@typescript-eslint': tsPlugin }
  }];
