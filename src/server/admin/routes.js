import { adminUsers } from '~/src/server/admin/users/routes.js'
import { adminTeams } from '~/src/server/admin/teams/routes.js'
import { adminFeatures } from '~/src/server/admin/features/routes.js'
import { adminPermissions } from '~/src/server/admin/permissions/routes.js'
import { adminDecommissionService } from '~/src/server/admin/decommission-service/routes.js'
import { adminTags } from '~/src/server/admin/tags/routes.js'
import { removeTestAsTenantScopeController } from '~/src/server/admin/permissions/controllers/remove/user/remove-test-as-tenant-permission.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

const admin = {
  plugin: {
    name: 'admin',
    register: async (server) => {
      await server.register([
        adminUsers,
        adminTeams,
        adminFeatures,
        adminPermissions,
        adminDecommissionService,
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
          ...authScope([`+${scopes.testAsTenant}`])
        }
      ])
    }
  }
}

export { admin }
