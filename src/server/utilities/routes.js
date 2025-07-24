import { provideSubNavigation } from './helpers/provide-sub-navigation.js'
import { templatesListController } from './controllers/templates-list-controller.js'
import { templateController } from './controllers/template-controller.js'
import { librariesListController } from './controllers/libraries-list-controller.js'
import { libraryController } from './controllers/library-controller.js'

const utilities = {
  plugin: {
    name: 'utilities',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
        {
          method: 'GET',
          path: '/utilities/templates',
          ...templatesListController
        },
        {
          method: 'GET',
          path: '/utilities/templates/{templateId}',
          ...templateController
        },
        {
          method: 'GET',
          path: '/utilities/libraries',
          ...librariesListController
        },
        {
          method: 'GET',
          path: '/utilities/libraries/{libraryId}',
          ...libraryController
        }
      ])
    }
  }
}

export { utilities }
