import { allProxyController } from '~/src/server/services/proxy/controllers/all.js'
import { environmentProxyController } from '~/src/server/services/proxy/controllers/environment.js'
import { provideSubNavigation } from '~/src/server/services/proxy/helpers/provide-sub-navigation.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { provideService } from '~/src/server/services/helpers/provide-service.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

export const serviceProxy = {
  plugin: {
    name: 'serviceProxy',
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
        },
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/services/{serviceId}/proxy',
            ...allProxyController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/proxy/{environment}',
            ...environmentProxyController
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}
