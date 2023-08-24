import { appConfig } from '~/src/config'
import { adminUsers } from '~/src/server/admin/users'
import { adminTeams } from '~/src/server/admin/teams'

const admin = {
  plugin: {
    name: 'admin',
    register: async (server) => {
      await server.register([adminUsers, adminTeams])

      server.route([
        {
          method: 'GET',
          path: '/admin',
          handler: (request, h) =>
            h.redirect(appConfig.get('appPathPrefix') + '/admin/users')
        }
      ])
    }
  }
}

export { admin }
