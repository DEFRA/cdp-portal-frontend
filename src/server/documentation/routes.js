import { searchController } from '~/src/server/documentation/controllers/search.js'
import { documentationController } from '~/src/server/documentation/controllers/documentation.js'
import { searchHandlerController } from '~/src/server/documentation/controllers/search-handler.js'
import { searchResultsController } from '~/src/server/documentation/controllers/search-results.js'

const documentation = {
  plugin: {
    name: 'documentation',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/documentation',
          handler: (_request, h) => h.redirect('/documentation/README.md')
        },
        {
          method: 'GET',
          path: '/documentation/search',
          ...searchController
        },
        {
          method: 'POST',
          path: '/documentation/search',
          ...searchHandlerController
        },
        {
          method: 'GET',
          path: '/documentation/search-results',
          ...searchResultsController
        },
        {
          method: 'GET',
          path: '/documentation/{documentationPath*}',
          ...documentationController
        }
      ])
    }
  }
}

export { documentation }
