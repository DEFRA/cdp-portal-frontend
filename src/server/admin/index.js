import { adminUsers } from '~/src/server/admin/users/index.js'
import { adminTeams } from '~/src/server/admin/teams/index.js'
import { features } from '~/src/server/admin/features/index.js'

const admin = {
  plugin: {
    name: 'admin',
    register: async (server) => {
      await server.register([adminUsers, adminTeams, features])

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
