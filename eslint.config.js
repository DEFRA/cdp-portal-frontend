import neostandard from 'neostandard'
import packageJson from 'eslint-plugin-package-json'
import vitest from '@vitest/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import importPlugin from 'eslint-plugin-import'
import n from 'eslint-plugin-n'
import promise from 'eslint-plugin-promise'
import jsdoc from 'eslint-plugin-jsdoc'
import globals from 'globals'

const customIgnores = [
  '.server',
  '.public',
  'src/__fixtures__',
  'coverage',
  '.husky',
  '.github',
  'node_modules',
  '.sonarlint',
  'raw-assets',
  '.prettierrc.js',
  '.vite/setup-files.js',
  '*.config.*',
  'vite.config.*',
  'vitest.config.*'
]

export default [
  ...neostandard({
    env: ['node', 'vitest', 'browser'],
    ignores: [...neostandard.resolveIgnoresFromGitignore(), ...customIgnores],
    noJsx: true,
    noStyle: true
  }),
  {
    files: ['**/*.{js,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: true,
        KeyboardEvent: true,
        Element: true,
        HTMLElement: true,
        location: true,
        window: true,
        localStorage: true,
        fetchMock: true,
        Option: true
      }
    },
    plugins: {
      import: importPlugin,
      jsdoc,
      n,
      promise,
      prettier,
      vitest
    },
    rules: {
      camelcase: 'off', // The mono-lambda property names are snake_case
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      'no-console': 'error',

      'jsdoc/require-jsdoc': 'off',
      'jsdoc/require-param-description': 'off',
      'jsdoc/require-param-type': 'error',
      'jsdoc/require-param': 'off',
      'jsdoc/require-property-description': 'off',
      'jsdoc/require-returns-description': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-returns': 'off',

      'import/extensions': ['error', 'always', { ignorePackages: true }],
      'import/default': 'off',
      'import/namespace': 'off',
      'n/no-extraneous-require': 'off',
      'n/no-extraneous-import': 'off',
      'n/no-missing-require': 'off',
      'n/no-missing-import': 'off',

      'n/no-unpublished-import': [
        'error',
        {
          allowModules: [
            'copy-webpack-plugin',
            'clean-webpack-plugin',
            'terser-webpack-plugin',
            'webpack-assets-manifest',
            'webpack-shell-plugin-next'
          ]
        }
      ],

      'vitest/expect-expect': [
        'error',
        { assertFunctionNames: ['expect', 'expect*'] }
      ]
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.cjs', '.js']
      },
      'import/resolver': {
        node: true,
        typescript: true
      }
    }
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'module'
    }
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      sourceType: 'commonjs'
    },
    rules: {
      'n/no-unpublished-require': ['error', { allowModules: [] }]
    }
  },
  {
    files: ['src/client/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  {
    files: [
      '.vite/**/*.js',
      '**/*.test.{js,cjs}',
      '**/__mocks__/**',
      '**/__fixtures__/**',
      'vitest.config.js',
      'test-helpers/**'
    ],
    plugins: { vitest },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      },
      globals: {
        ...vitest.environments.env.globals
      }
    },
    rules: {
      ...vitest.configs.recommended.rules,
      'n/no-unpublished-import': [
        'error',
        {
          allowModules: [
            'vitest',
            'filenamify',
            'nock',
            'cheerio',
            '@hapi/catbox-memory',
            '@testing-library/dom',
            'jest-file-snapshot'
          ]
        }
      ]
    }
  },
  {
    ...packageJson.configs.recommended,
    rules: {
      ...packageJson.configs.recommended.rules,
      'package-json/restrict-dependency-ranges': [
        'error',
        {
          forDependencyTypes: ['dependencies', 'devDependencies'],
          rangeType: 'pin'
        }
      ]
    }
  }
]
