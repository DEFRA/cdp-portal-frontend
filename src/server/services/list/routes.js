import { provideListTabs } from './helpers/provide-list-tabs.js'
import { servicesListRoute } from './routes/services-list.js'
import { servicesFavouritesListRoute } from './routes/services-favourites-list.js'

const listServices = {
  plugin: {
    name: 'listServices',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideListTabs,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
        {
          method: 'GET',
          path: '/services',
          ...servicesFavouritesListRoute
        },
        {
          method: 'GET',
          path: '/services/all',
          ...servicesListRoute
        }
      ])
    }
  }
}

export { listServices }
