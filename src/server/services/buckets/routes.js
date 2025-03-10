import { allBucketsController } from '~/src/server/services/buckets/controllers/all.js'
import { environmentBucketsController } from '~/src/server/services/buckets/controllers/environment.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

export const serviceBuckets = [
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
