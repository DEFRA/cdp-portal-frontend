import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { summaryController } from '~/src/server/update-database/controllers/summary.js'
import { multistepForm } from '~/src/server/common/helpers/multistep-form/multistep-form.js'
import { startUpdateDatabaseController } from '~/src/server/update-database/controllers/start-update-database.js'
import { availableMigrationsController } from '~/src/server/update-database/controllers/available-migrations.js'
import { changeDetailsFormController } from '~/src/server/update-database/controllers/change-details-form.js'
import { changeDetailsController } from '~/src/server/update-database/controllers/change-details.js'
import { runController } from '~/src/server/update-database/controllers/run.js'
import {
  urls,
  formSteps
} from '~/src/server/update-database/helpers/multistep-form/steps.js'

const serviceTeamAndAdminWithPostgresRestrictedTechUserScope = authScope([
  scopes.tenant,
  scopes.admin,
  `+${scopes.restrictedTechPostgres}`
])

/**
 * The update database schema plugin
 * @satisfies {import('@hapi/hapi').Plugin}
 */
const updateDatabase = {
  plugin: {
    name: 'update database',
    register: async (server) => {
      await server.register({
        plugin: multistepForm,
        options: {
          urls,
          formSteps,
          classes: 'app-step-navigation-container--small',
          routes: [
            {
              method: 'GET',
              path: '/update-database',
              ...startUpdateDatabaseController
            },
            {
              method: 'GET',
              path: '/update-database/change-details/{multiStepFormId?}',
              ...changeDetailsFormController
            },
            {
              method: 'POST',
              path: '/update-database/change-details/{multiStepFormId?}',
              ...changeDetailsController
            },
            {
              method: 'GET',
              path: '/update-database/summary/{multiStepFormId}',
              ...summaryController
            },
            {
              method: 'POST',
              path: '/update-database/run/{multiStepFormId}',
              ...runController
            }
          ].map(serviceTeamAndAdminWithPostgresRestrictedTechUserScope)
        }
      })

      server.route(
        [
          {
            method: 'GET',
            path: '/update-database/available-migrations',
            ...availableMigrationsController
          }
        ].map(serviceTeamAndAdminWithPostgresRestrictedTechUserScope)
      )
    }
  }
}

export { updateDatabase }
