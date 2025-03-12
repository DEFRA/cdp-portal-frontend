import { allProxyController } from '~/src/server/services/service/proxy/controllers/all.js'
import { environmentProxyController } from '~/src/server/services/service/proxy/controllers/environment.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { provideSubNavForServiceOrTestSuite } from '~/src/server/helpers/provide-sub-navigation.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

export const serviceProxy = {
  plugin: {
    name: 'serviceProxy',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
        {
          type: 'onPostHandler',
          method: provideSubNavForServiceOrTestSuite('proxy', 'service'),
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
