import { isNameAvailableController } from './controllers/is-name-available.js'
import { startController } from './controllers/start.js'
import { chooseKindController } from './controllers/choose-kind.js'
import { chooseKindFormController } from './controllers/choose-kind-form.js'
import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '../common/helpers/auth/auth-scope.js'
import { sessionNames } from '../common/constants/session-names.js'
import { checkFeatureToggle } from '../admin/features/helpers/check-feature-toggle.js'
import { formSteps, urlTemplates } from './helpers/form/steps.js'
import { multistepForm } from '#server/plugins/multistep-form/multistep-form.js'
import { kindDetailFormController } from './controllers/kind/detail-form.js'
import { kindDetailController } from './controllers/kind/detail.js'
import { kindSummaryController } from './controllers/kind/summary.js'
import { kindCreateController } from './controllers/kind/create.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

const serverExtensions = [
  {
    type: 'onPreHandler',
    method: checkFeatureToggle,
    options: {
      sandbox: 'plugin'
    }
  }
]

const create = {
  plugin: {
    name: 'create',
    register: async (server) => {
      server.ext(serverExtensions)

      await server.register({
        plugin: multistepForm,
        options: {
          sessionName: sessionNames.create,
          urlTemplates,
          formSteps,
          ext: serverExtensions,
          routes: [
            {
              method: 'GET',
              path: '/create',
              ...startController
            },
            {
              method: 'GET',
              path: '/create/choose-kind',
              ...chooseKindFormController
            },
            {
              method: 'POST',
              path: '/create/choose-kind',
              ...chooseKindController
            },
            {
              method: 'GET',
              path: '/create/{kind}/detail',
              ...kindDetailFormController
            },
            {
              method: 'POST',
              path: '/create/{kind}/detail',
              ...kindDetailController
            },
            {
              method: 'GET',
              path: '/create/{kind}/summary',
              ...kindSummaryController
            },
            {
              method: 'POST',
              path: '/create/{kind}',
              ...kindCreateController
            }
          ].map(serviceTeamAndAdminUserScope)
        }
      })

      server.route(
        [
          {
            method: 'GET',
            path: '/create/is-name-available/{repositoryName}',
            ...isNameAvailableController
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}

export { create }
