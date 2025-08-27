import { authScope } from '../common/helpers/auth/auth-scope.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import { summaryController } from './controllers/summary.js'
import { multistepForm } from '../common/helpers/multistep-form/multistep-form.js'
import { availableMigrationsController } from './controllers/available-migrations.js'
import { changeDetailsFormController } from './controllers/change-details-form.js'
import { changeDetailsController } from './controllers/change-details.js'
import { applyController } from './controllers/apply.js'
import { startApplyChangelogController } from './controllers/start-apply-changelog.js'
import { urls, formSteps } from './helpers/multistep-form/steps.js'

const serviceTeamAndAdminWithPostgresRestrictedTechScope = authScope([
  scopes.tenant,
  scopes.admin,
  `+${scopes.restrictedTechPostgres}`
])

/**
 * The apply changelog plugin
 * @satisfies {import('@hapi/hapi').Plugin}
 */
const applyChangelog = {
  plugin: {
    name: 'applyChangelog',
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
              path: '/apply-changelog',
              ...startApplyChangelogController
            },
            {
              method: 'GET',
              path: '/apply-changelog/change-details/{multiStepFormId?}',
              ...changeDetailsFormController
            },
            {
              method: 'POST',
              path: '/apply-changelog/change-details/{multiStepFormId?}',
              ...changeDetailsController
            },
            {
              method: 'GET',
              path: '/apply-changelog/summary/{multiStepFormId}',
              ...summaryController
            },
            {
              method: 'POST',
              path: '/apply-changelog/run/{multiStepFormId}',
              ...applyController
            }
          ].map(serviceTeamAndAdminWithPostgresRestrictedTechScope)
        }
      })

      server.route(
        [
          {
            method: 'GET',
            path: '/apply-changelog/available-migrations',
            ...availableMigrationsController
          }
        ].map(serviceTeamAndAdminWithPostgresRestrictedTechScope)
      )
    }
  }
}

export { applyChangelog }
