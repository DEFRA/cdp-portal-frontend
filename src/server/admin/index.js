import { adminUsers } from '~/src/server/admin/users'
import { adminTeams } from '~/src/server/admin/teams'
import { provideSubNav } from '~/src/server/admin/helpers/provide-sub-nav'

const admin = {
  plugin: {
    name: 'admin',
    register: async (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNav
        }
      ])

      server.route([...adminUsers, ...adminTeams])
    }
  }
}

export { admin }
