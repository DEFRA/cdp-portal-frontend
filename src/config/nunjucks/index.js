const nunjucks = require('nunjucks')

const { config } = require('../index')
const { globalContext } = require('./global-context')

module.exports = {
  plugin: require('@hapi/vision'),
  options: {
    engines: {
      njk: {
        compile: (src, options) => {
          const template = nunjucks.compile(src, options.environment)
          return (context) => template.render(context)
        },
      },
    },
    compileOptions: {
      environment: nunjucks.configure([
        'node_modules/govuk-frontend/',
        'src/common/templates',
      ], {
        autoescape: true,
        throwOnUndefined: false,
        trimBlocks: true,
        lstripBlocks: true,
        watch: config.get('isDevelopment'),
        noCache: config.get('isDevelopment'),
      }),
    },
    path: 'src/app',
    isCached: config.get('isProduction'),
    context: globalContext
  },
}
