import { scopes } from '@defra/cdp-validation-kit'

import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { decommissionController } from './controllers/decommission.js'
import { provideFormContextValues } from '../../common/helpers/form/provide-form-context-values.js'
import { decommissionFormController } from './controllers/decommission-form.js'
import { decommissionsListController } from './controllers/decommissions-list.js'
import { startDecommissionController } from './controllers/start-decommission.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'

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
