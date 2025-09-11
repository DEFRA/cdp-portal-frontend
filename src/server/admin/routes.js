import { scopes } from '@defra/cdp-validation-kit'

import { adminTags } from './tags/routes.js'
import { adminUsers } from './users/routes.js'
import { adminTeams } from './teams/routes.js'
import { adminFeatures } from './features/routes.js'
import { authScope } from '../common/helpers/auth/auth-scope.js'
import { adminPermissions } from './permissions/routes.js'
import { adminDecommissions } from './decommissions/routes.js'
import { removeTestAsTenantScopeController } from './permissions/controllers/remove/user/remove-test-as-tenant-permission.js'
import { adminAudit } from './audit/routes.js'

const admin = {
  plugin: {
    name: 'admin',
    register: async (server) => {
      await server.register([
        adminUsers,
        adminTeams,
        adminFeatures,
        adminPermissions,
        adminDecommissions,
        adminAudit,
        adminTags
      ])

      server.route([
        {
          method: 'GET',
          path: '/admin',
          options: {
            id: 'admin'
          },
          handler: (_request, h) => h.redirect('/admin/users')
        },
        {
          method: 'GET',
          path: '/admin/removeTestAsTenant',
          ...removeTestAsTenantScopeController,
          ...authScope([scopes.testAsTenant])
        }
      ])
    }
  }
}

export { admin }
