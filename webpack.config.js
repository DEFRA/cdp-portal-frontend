import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import CopyPlugin from 'copy-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import TerserPlugin from 'terser-webpack-plugin'
import { WebpackAssetsManifest } from 'webpack-assets-manifest'
import WebpackShellPluginNext from 'webpack-shell-plugin-next'

const { NODE_ENV = 'development', DEBUG } = process.env
const isProduction = NODE_ENV === 'production'
const isDevelopment = NODE_ENV === 'development'

const require = createRequire(import.meta.url)
const dirname = path.dirname(fileURLToPath(import.meta.url))

const govukFrontendPath = path.dirname(
  require.resolve('govuk-frontend/package.json')
)
const clientPath = path.resolve(dirname, 'src/client')
const ruleTypeAssetResource = 'asset/resource'

/**
 * @type {Configuration}
 */
// TODO split this work in dev and prod configs
const config = {
  context: clientPath,
  entry: {
    application: {
      import: ['./javascripts/application.js', './stylesheets/application.scss']
    }
  },
  experiments: {
    outputModule: true
  },
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  watchOptions: {
    aggregateTimeout: 0
  },
  output: {
    filename: isProduction
      ? 'javascripts/[name].[contenthash:7].min.js'
      : 'javascripts/[name].js',

    chunkFilename: isProduction
      ? 'javascripts/[name].[chunkhash:7].min.js'
      : 'javascripts/[name].js',

    path: path.join(dirname, '.public'),
    publicPath: '/public/',
    libraryTarget: 'module',
    module: true
  },
  resolve: {
    alias: {
      '/public/assets': path.join(govukFrontendPath, 'dist/govuk/assets')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|scss)$/,
        loader: 'source-map-loader',
        enforce: 'pre'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          browserslistEnv: 'javascripts',
          cacheDirectory: true,
          extends: path.join(dirname, 'babel.config.cjs'),
          presets: [
            [
              '@babel/preset-env',
              {
                // Apply bug fixes to avoid transforms
                bugfixes: true,

                // Apply smaller "loose" transforms for browsers
                loose: true,

                // Skip CommonJS modules transform
                modules: false
              }
            ]
          ]
        },

        // Flag loaded modules as side effect free
        sideEffects: false
      },
      {
        test: /\.scss$/,
        type: ruleTypeAssetResource,
        generator: {
          binary: false,
          filename: isProduction
            ? 'stylesheets/[name].[contenthash:7].min.css'
            : 'stylesheets/[name].css'
        },
        use: [
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                loadPaths: [
                  path.join(dirname, 'src/client/stylesheets'),
                  path.join(dirname, 'src/server/common/components'),
                  path.join(dirname, 'src/server/common/templates/partials')
                ],
                quietDeps: true,
                sourceMapIncludeSources: true,
                style: 'expanded'
              },
              warnRuleAsWarning: true
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        type: ruleTypeAssetResource,
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.(ico)$/,
        type: ruleTypeAssetResource,
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: ruleTypeAssetResource,
        generator: {
          filename: 'assets/fonts/[name][ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: isProduction,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          // Use webpack default compress options
          // https://webpack.js.org/configuration/optimization/#optimizationminimizer
          compress: { passes: 2 },

          // Allow Terser to remove @preserve comments
          format: { comments: false },

          // Include sources content from dependency source maps
          sourceMap: {
            includeSources: true
          },

          // Compatibility workarounds
          safari10: true
        }
      })
    ],
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          name({ userRequest }) {
            const [[modulePath, pkgName]] = userRequest.matchAll(
              /node_modules\/([^\\/]+)/g
            )

            // Move into /javascripts/vendor
            return path.join('vendor', pkgName || modulePath)
          }
        }
      }
    },

    // Skip bundling unused modules
    providedExports: true,
    sideEffects: true,
    usedExports: true
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackAssetsManifest(),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(govukFrontendPath, 'dist/govuk/assets'),
          to: 'assets',
          globOptions: {
            ignore: [
              path.join(govukFrontendPath, 'dist/govuk/assets/rebrand'),
              path.join(govukFrontendPath, 'dist/govuk/assets/images')
            ]
          }
        },
        {
          from: path.join(govukFrontendPath, 'dist/govuk/assets/rebrand'),
          to: 'assets'
        },
        {
          from: path.join(clientPath, 'images'),
          to: 'assets/images'
        }
      ]
    })
  ],
  stats: {
    errorDetails: true,
    loggingDebug: ['sass-loader'],
    preset: 'minimal'
  },
  target: 'browserslist:javascripts'
}

if (isDevelopment) {
  config.plugins.push(
    new WebpackShellPluginNext({
      onBuildStart: {
        scripts: ['echo "Webpack build starting"'],
        blocking: false,
        parallel: true
      },
      onBuildEnd: {
        scripts: [DEBUG ? 'npm run server:debug' : 'npm run server:watch'],
        blocking: false,
        parallel: true
      }
    })
  )
}

export default config

/**
 * @import { Configuration } from 'webpack'
 */
