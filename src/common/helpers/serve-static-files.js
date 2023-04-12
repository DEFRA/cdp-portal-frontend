const { config } = require('../../config')

const serveStaticFiles = {
  method: 'GET',
  path: '/public/{param*}',
  handler: {
    directory: {
      path: '.',
      redirectToSlash: true
    }
  },
  options: {
    cache: {
      expiresIn: config.get('staticCacheTimeout'),
      privacy: 'private'
    }
  }
}

module.exports = {
  serveStaticFiles
}
