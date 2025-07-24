import { allProxyController } from '../../../common/patterns/entities/tabs/proxy/controllers/all.js'
import { environmentProxyController } from '../../../common/patterns/entities/tabs/proxy/controllers/environment.js'
import { scopes } from '../../../common/constants/scopes.js'
import { authScope } from '../../../common/helpers/auth/auth-scope.js'
import { commonTestSuiteExtensions } from '../../../common/helpers/extensions.js'
import { provideSubNav } from '../../../helpers/provide-sub-navigation.js'
import { TEST_SUITE } from '../../../common/patterns/entities/tabs/constants.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

export const testSuiteProxies = {
  plugin: {
    name: 'testSuiteProxies',
    register: (server) => {
      server.ext([
        ...commonTestSuiteExtensions,
        {
          type: 'onPostHandler',
          method: provideSubNav('proxy', TEST_SUITE),
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/proxy',
            ...allProxyController(TEST_SUITE)
          },
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/proxy/{environment}',
            ...environmentProxyController(TEST_SUITE)
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}
