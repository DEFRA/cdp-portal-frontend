import { adminUsers } from '~/src/server/admin/users'
import { adminTeams } from '~/src/server/admin/teams'
import { features } from '~/src/server/admin/features'

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
