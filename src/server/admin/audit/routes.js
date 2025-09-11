import { scopes } from '@defra/cdp-validation-kit'

import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { provideFormContextValues } from '../../common/helpers/form/provide-form-context-values.js'
import { auditListController } from './controllers/audit-list.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'

const adminScope = authScope([scopes.admin])

export const adminAudit = {
  plugin: {
    name: 'adminAudit',
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
            path: '/admin/audit',
            ...auditListController
          }
        ].map(adminScope)
      )
    }
  }
}
