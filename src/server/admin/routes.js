import { adminUsers } from '~/src/server/admin/users/routes.js'
import { adminTeams } from '~/src/server/admin/teams/routes.js'
import { adminFeatures } from '~/src/server/admin/features/routes.js'
import { adminPermissions } from '~/src/server/admin/permissions/routes.js'

const admin = {
  plugin: {
    name: 'admin',
    register: async (server) => {
      await server.register([
        adminUsers,
        adminTeams,
        adminFeatures,
        adminPermissions
      ])

      server.route([
        {
          method: 'GET',
          path: '/admin',
          handler: (request, h) => h.redirect('/admin/users')
        }
      ])
    }
  }
}

export { admin }
