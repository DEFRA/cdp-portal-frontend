const { NODE_ENV } = process.env

/**
 * @type {TransformOptions}
 */
module.exports = {
  browserslistEnv: 'node',
  presets: [
    [
      '@babel/preset-env',
      {
        bugfixes: true,
        modules: NODE_ENV === 'test' ? 'auto' : false
      }
    ]
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '~': '.'
        }
      }
    ],
    '@babel/plugin-syntax-import-attributes'
  ]
}

/**
 * @import { TransformOptions } from '@babel/core'
 */
