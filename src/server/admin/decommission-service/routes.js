import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { decommissionFormController } from '~/src/server/admin/decommission-service/controllers/decommission-form.js'
import { decommissionServiceController } from '~/src/server/admin/decommission-service/controllers/decommission-service.js'
import { summaryController } from '~/src/server/admin/decommission-service/controllers/summary.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'

const adminScope = authScope([`+${scopes.admin}`])

const adminDecommissionService = {
  plugin: {
    name: 'decommission service',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/admin/decommission-service',
            ...decommissionFormController
          },
          {
            method: 'POST',
            path: '/admin/decommission-service',
            ...decommissionServiceController
          },
          {
            method: 'GET',
            path: '/admin/decommission-service/summary',
            ...summaryController
          }
        ].map(adminScope)
      )
    }
  }
}

export { adminDecommissionService }
