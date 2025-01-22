import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { decommissionFormController } from '~/src/server/admin/decommission-service/controllers/form.js'
import { decommissionServiceController } from '~/src/server/admin/decommission-service/controllers/service.js'
import { decommissionStep1Controller } from '~/src/server/admin/decommission-service/controllers/step-1.js'
import { decommissionContinueController } from '~/src/server/admin/decommission-service/controllers/continue.js'
import { decommissionStep2Controller } from '~/src/server/admin/decommission-service/controllers/step-2.js'
import { decommissionFinishController } from '~/src/server/admin/decommission-service/controllers/finish.js'
import { decommissionSummaryController } from '~/src/server/admin/decommission-service/controllers/summary.js'
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
            path: '/admin/decommission-service/{serviceName}/step-1',
            ...decommissionStep1Controller
          },
          {
            method: 'POST',
            path: '/admin/decommission-service/{serviceName}/continue',
            ...decommissionContinueController
          },
          {
            method: 'GET',
            path: '/admin/decommission-service/{serviceName}/step-2',
            ...decommissionStep2Controller
          },
          {
            method: 'POST',
            path: '/admin/decommission-service/{serviceName}/finish',
            ...decommissionFinishController
          },
          {
            method: 'GET',
            path: '/admin/decommission-service/{serviceName}/summary',
            ...decommissionSummaryController
          }
        ].map(adminScope)
      )
    }
  }
}

export { adminDecommissionService }
