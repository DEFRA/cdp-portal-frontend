import { allBucketsController } from './controllers/all.js'
import { environmentBucketsController } from './controllers/environment.js'
import { scopes } from '../../../common/constants/scopes.js'
import { authScope } from '../../../common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '../../../common/helpers/extensions.js'
import { provideSubNav } from '../../../helpers/provide-sub-navigation.js'
import { SERVICE } from '../../../common/patterns/entities/tabs/constants.js'

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
