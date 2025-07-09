import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { decommissionController } from '~/src/server/admin/decommissions/controllers/decommission.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { decommissionFormController } from '~/src/server/admin/decommissions/controllers/decommission-form.js'
import { decommissionsListController } from '~/src/server/admin/decommissions/controllers/decommissions-list.js'
import { startDecommissionController } from '~/src/server/admin/decommissions/controllers/start-decommission.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'

const adminScope = authScope([`+${scopes.admin}`])

const adminDecommissions = {
  plugin: {
    name: 'adminDecommissions',
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
            path: '/admin/decommissions',
            ...decommissionsListController
          },
          {
            method: 'GET',
            path: '/admin/decommissions/{repositoryName}',
            ...decommissionController
          },
          {
            method: 'GET',
            path: '/admin/decommissions/start',
            ...decommissionFormController
          },
          {
            method: 'POST',
            path: '/admin/decommissions/start',
            ...startDecommissionController
          }
        ].map(adminScope)
      )
    }
  }
}

export { adminDecommissions }
