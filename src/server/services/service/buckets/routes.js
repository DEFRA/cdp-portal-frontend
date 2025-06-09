import { allBucketsController } from '~/src/server/services/service/buckets/controllers/all.js'
import { environmentBucketsController } from '~/src/server/services/service/buckets/controllers/environment.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { provideSubNav } from '~/src/server/helpers/provide-sub-navigation.js'
import { SERVICE } from '~/src/server/common/patterns/entities/tabs/constants.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

const serviceBuckets = {
  plugin: {
    name: 'serviceBuckets',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
        {
          type: 'onPostHandler',
          // TODO this is a very long name - can it be improved?
          method: provideSubNav('buckets', SERVICE),

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
