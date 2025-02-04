import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { costsListController } from '~/src/server/admin/costs/controllers/costs-list.js'
import { costController } from '~/src/server/admin/costs/controllers/cost.js'

const adminScope = authScope([`+${scopes.admin}`])

const adminCosts = {
  plugin: {
    name: 'costs',
    register: (server) => {
      server.ext([
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
            path: '/admin/costs',
            ...costsListController
          },
          {
            method: 'GET',
            path: '/admin/costs/{serviceCode}',
            ...costController
          }
        ].map(adminScope)
      )
    }
  }
}
export { adminCosts }
