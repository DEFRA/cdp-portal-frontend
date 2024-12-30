import { provideSubNavigation } from '~/src/server/utilities/helpers/provide-sub-navigation.js'
import { templatesListController } from '~/src/server/utilities/controllers/templates-list-controller.js'
import { templateController } from '~/src/server/utilities/controllers/template-controller.js'
import { librariesListController } from '~/src/server/utilities/controllers/libraries-list-controller.js'
import { libraryController } from '~/src/server/utilities/controllers/library-controller.js'

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
