import { searchRoute } from './routes/search.js'
import { documentationRoute } from './routes/documentation.js'
import { searchHandlerRoute } from './routes/search-handler.js'
import { searchResultsRoute } from './routes/search-results.js'

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
          ...searchRoute
        },
        {
          method: 'POST',
          path: '/documentation/search',
          ...searchHandlerRoute
        },
        {
          method: 'GET',
          path: '/documentation/search-results',
          ...searchResultsRoute
        },
        {
          method: 'GET',
          path: '/documentation/{documentationPath*}',
          ...documentationRoute
        }
      ])
    }
  }
}

export { documentation }
