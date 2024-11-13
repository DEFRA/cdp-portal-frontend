import { adminUsers } from '~/src/server/admin/users/index.js'
import { adminTeams } from '~/src/server/admin/teams/index.js'
import { features } from '~/src/server/admin/features/index.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const admin = {
  plugin: {
    name: 'admin',
    register: async (server) => {
      await server.register([adminUsers, adminTeams, features])

      server.route(
        [
          {
            method: 'GET',
            path: '/admin',
            handler: (request, h) => h.redirect('/admin/users')
          }
        ].map(withTracing)
      )
    }
  }
}

export { admin }
