import { allProxyController } from '~/src/server/common/patterns/entities/tabs/proxy/controllers/all.js'
import { environmentProxyController } from '~/src/server/common/patterns/entities/tabs/proxy/controllers/environment.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { provideSubNav } from '~/src/server/helpers/provide-sub-navigation.js'
import { SERVICE } from '~/src/server/common/patterns/entities/tabs/constants.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

export const serviceProxy = {
  plugin: {
    name: 'serviceProxy',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
        {
          type: 'onPostHandler',
          method: provideSubNav('proxy', SERVICE),
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
            ...allProxyController(SERVICE)
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/proxy/{environment}',
            ...environmentProxyController(SERVICE)
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}
