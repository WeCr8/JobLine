import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import vuePlugin from 'eslint-plugin-vue';

export default [
  {
    ignores: [
      'node_modules/',
      'dist/',
      'public/',
      '*.config.js',
      '*.d.ts',
      '**/*.vue.js',
      '**/*.vue.ts',
      'supabase/functions/**/*.ts',
    ],
  },
  // Base JS config
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: js.configs.recommended.rules,
  },
  // TypeScript config
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_' 
      }],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-function': 'warn',
    },
  },
  // Vue config
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: vuePlugin,
    },
    rules: {
      ...vuePlugin.configs['vue3-recommended'].rules,
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'warn',
      'vue/html-indent': ['error', 2],
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }],
      'vue/max-attributes-per-line': ['error', {
        singleline: 3,
        multiline: 1
      }],
    },
  },
  // Import plugin config
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-unresolved': 'off',
      'import/named': 'error',
      'import/default': 'error',
      'import/export': 'error',
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        'alphabetize': {
          'order': 'asc',
          'caseInsensitive': true
        }
      }],
    },
  },
  // Project-specific overrides
  {
    files: ['src/**/*.ts', 'src/**/*.vue'],
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always', { 'null': 'ignore' }],
      'curly': ['error', 'all'],
      'max-len': ['warn', { 
        'code': 120, 
        'ignoreUrls': true, 
        'ignoreStrings': true, 
        'ignoreTemplateLiterals': true,
        'ignoreRegExpLiterals': true 
      }],
      'no-unused-expressions': 'warn',
      'no-undef': 'error',
      'no-use-before-define': 'error',
      'no-duplicate-imports': 'error',
      'array-callback-return': 'error',
      'consistent-return': 'warn',
      'default-case': 'warn',
      'dot-notation': 'warn',
      'no-alert': 'warn',
      'no-else-return': 'warn',
      'no-empty-function': 'warn',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-return-await': 'warn',
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'warn',
      'require-await': 'warn',
    },
  },
];