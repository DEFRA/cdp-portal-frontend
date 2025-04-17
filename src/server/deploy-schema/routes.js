import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { startDeploySchemaController } from '~/src/server/deploy-schema/controllers/deploy/start-deploy-schema.js'
import { detailsController } from '~/src/server/deploy-schema/controllers/deploy/details.js'
import { detailsFormController } from '~/src/server/deploy-schema/controllers/deploy/details-form.js'
import { summaryController } from '~/src/server/deploy-schema/controllers/deploy/summary.js'
import { deployController } from '~/src/server/deploy-schema/controllers/deploy/deploy.js'
import { multistepForm } from '~/src/server/common/helpers/multistep-form/multistep-form.js'
import { availableVersionsController } from '~/src/server/deploy-schema/controllers/available-versions.js'
import {
  urls,
  formSteps
} from '~/src/server/deploy-schema/helpers/multistep-form/steps.js'

const serviceTeamAndAdminWithPostgresRestrictedTechUserScope = authScope([
  scopes.tenant,
  scopes.admin,
  `+${scopes.restrictedTechPostgres}`
])

/**
 * The deploy schema plugin
 * @satisfies {import('@hapi/hapi').Plugin}
 */
const deploySchema = {
  plugin: {
    name: 'deploy schema',
    register: async (server) => {
      await server.register({
        plugin: multistepForm,
        options: {
          urls,
          formSteps,
          routes: [
            {
              method: 'GET',
              path: '/deploy-schema',
              ...startDeploySchemaController
            },
            {
              method: 'GET',
              path: '/deploy-schema/details/{multiStepFormId?}',
              ...detailsFormController
            },
            {
              method: 'POST',
              path: '/deploy-schema/details/{multiStepFormId?}',
              ...detailsController
            },
            {
              method: 'GET',
              path: '/deploy-schema/summary/{multiStepFormId}',
              ...summaryController
            },
            {
              method: 'POST',
              path: '/deploy-schema/deploy/{multiStepFormId}',
              ...deployController
            }
          ].map(serviceTeamAndAdminWithPostgresRestrictedTechUserScope)
        }
      })

      server.route(
        [
          {
            method: 'GET',
            path: '/deploy-schema/available-versions',
            ...availableVersionsController
          }
        ].map(serviceTeamAndAdminWithPostgresRestrictedTechUserScope)
      )
    }
  }
}

export { deploySchema }
