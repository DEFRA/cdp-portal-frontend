import { allBucketsController } from '~/src/server/services/buckets/controllers/all.js'
import { environmentBucketsController } from '~/src/server/services/buckets/controllers/environment.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { provideSubNavigation } from '~/src/server/services/buckets/helpers/provide-sub-navigation.js'
import { provideService } from '~/src/server/services/helpers/provide-service.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

const serviceBuckets = {
  plugin: {
    name: 'serviceBuckets',
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
