import { allProxyController } from '~/src/server/services/proxy/controllers/all.js'
import { environmentProxyController } from '~/src/server/services/proxy/controllers/environment.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

export const serviceProxy = [
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
