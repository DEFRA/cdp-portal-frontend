import { allProxyRulesController } from '~/src/server/services/proxy-rules/controllers/all.js'
import { environmentProxyRulesController } from '~/src/server/services/proxy-rules/controllers/environment.js'
import { provideSubNavigation } from '~/src/server/services/proxy-rules/helpers/provide-sub-navigation.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { provideService } from '~/src/server/services/helpers/provide-service.js'

const adminUserScope = authScope([scopes.admin])

export const serviceProxyRules = {
  plugin: {
    name: 'serviceProxyRules',
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
            path: '/services/{serviceId}/proxy-rules',
            ...allProxyRulesController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/proxy-rules/{environment}',
            ...environmentProxyRulesController
          }
        ].map(adminUserScope)
      )
    }
  }
}
