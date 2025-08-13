import { allResourcesController } from './controllers/all.js'
import { environmentResourcesController } from './controllers/environment.js'
import { scopes } from '../../../common/constants/scopes.js'
import { authScope } from '../../../common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '../../../common/helpers/extensions.js'
import { provideSubNav } from '../../../helpers/provide-sub-navigation.js'
import { SERVICE } from '../../../common/patterns/entities/tabs/constants.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

const serviceResources = {
  plugin: {
    name: 'serviceResources',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
        {
          type: 'onPostHandler',
          method: provideSubNav('resources', SERVICE),
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/services/{serviceId}/resources',
            ...allResourcesController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/resources/{environment}',
            ...environmentResourcesController
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { serviceResources }
