import { serviceController } from '~/src/server/services/about/controllers/service.js'
import { serviceListController } from '~/src/server/services/about/controllers/service-list.js'
import { serviceCreateStatusController } from '~/src/server/services/about/controllers/service-create-status.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { provideService } from '~/src/server/services/helpers/provide-service.js'

const aboutService = {
  plugin: {
    name: 'aboutService',
    register: (server) => {
      server.ext([
        {
          type: 'onPreAuth',
          method: provideService,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideTabs,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
        {
          method: 'GET',
          path: '/services',
          ...serviceListController
        },
        {
          method: 'GET',
          path: '/services/{serviceId}',
          ...serviceController
        },
        {
          method: 'GET',
          // TODO align this url with the other services urls: '/services/{serviceId}/create-status'
          path: '/services/create-status/{serviceId}',
          ...serviceCreateStatusController
        }
      ])
    }
  }
}

export { aboutService }
