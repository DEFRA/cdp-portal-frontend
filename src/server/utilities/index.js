import {
  templatesListController,
  librariesListController,
  libraryController,
  templateController
} from '~/src/server/utilities/controllers'
import { provideSubNavigation } from '~/src/server/utilities/helpers/provide-sub-navigation'

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
