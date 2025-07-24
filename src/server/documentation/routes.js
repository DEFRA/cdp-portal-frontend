import { searchController } from './controllers/search.js'
import { documentationController } from './controllers/documentation.js'
import { searchHandlerController } from './controllers/search-handler.js'
import { searchResultsController } from './controllers/search-results.js'

const documentation = {
  plugin: {
    name: 'documentation',
    register: (server) => {
      server.route([
        {
          method: 'GET',
          path: '/documentation',
          options: {
            id: 'documentation'
          },
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
