import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { databaseDeploymentController } from '~/src/server/database-deployments/controllers/database-deployment.js'

const serviceTeamAndAdminWithPostgresRestrictedTechUserScope = authScope([
  scopes.tenant,
  scopes.admin,
  `+${scopes.restrictedTechPostgres}`
])

// TODO this is a temporary route, shortly to be merged into deployments

/**
 * The database deployments schema plugin
 * @satisfies {import('@hapi/hapi').Plugin}
 */
const databaseDeployments = {
  plugin: {
    name: 'databaseDeployments',
    register: (server) => {
      server.route(
        [
          {
            method: 'GET',
            path: '/database-deployments/{environment}/{migrationId}',
            ...databaseDeploymentController
          }
        ].map(serviceTeamAndAdminWithPostgresRestrictedTechUserScope)
      )
    }
  }
}

export { databaseDeployments }
