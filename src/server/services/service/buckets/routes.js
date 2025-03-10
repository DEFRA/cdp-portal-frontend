import { allBucketsController } from '~/src/server/services/service/buckets/controllers/all.js'
import { environmentBucketsController } from '~/src/server/services/service/buckets/controllers/environment.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '~/src/server/services/service/buckets/helpers/provide-sub-navigation.js'
import { commonServiceExtensions } from '~/src/server/services/helpers/extensions.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

const serviceBuckets = {
  plugin: {
    name: 'serviceBuckets',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
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
            path: '/services/{serviceId}/buckets',
            ...allBucketsController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/buckets/{environment}',
            ...environmentBucketsController
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { serviceBuckets }
