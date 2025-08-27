import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import { authScope } from '../../../common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '../../../common/helpers/ext/extensions.js'
import { provideFormContextValues } from '../../../common/helpers/form/provide-form-context-values.js'
import { autoTestRunsController } from './controllers/auto-test-runs.js'
import { autoDeploymentsController } from './controllers/auto-deployments.js'
import { setupAutoTestRunController } from './controllers/create-auto-test-runs.js'
import { setupAutoDeployController } from './controllers/save-auto-deployments.js'
import { provideAutomationSubNavigation } from './helpers/provide-sub-navigation.js'
import { removeTestRunFormController } from './controllers/remove/remove-test-run-form.js'
import { removeTestRunController } from './controllers/remove/remove-test-run.js'
import { updateTestRunFormController } from './controllers/update/update-test-run-form.js'
import { updateTestRunController } from './controllers/update/update-test-run.js'

const adminUserScope = authScope([scopes.admin, scopes.serviceOwner])

const serviceAutomations = {
  plugin: {
    name: 'serviceAutomations',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideAutomationSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            options: {
              id: 'services/{serviceId}/automations'
            },
            method: 'GET',
            path: '/services/{serviceId}/automations',
            handler: (request, h) =>
              h.redirect(
                request.routeLookup(
                  'services/{serviceId}/automations/deployments',
                  { params: { serviceId: request.params.serviceId } }
                )
              )
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/automations/deployments',
            ...autoDeploymentsController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/automations/deployments',
            ...setupAutoDeployController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/automations/test-runs',
            ...autoTestRunsController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/automations/test-runs',
            ...setupAutoTestRunController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/automations/test-runs/{testSuiteId}/remove',
            ...removeTestRunFormController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/automations/test-runs/{testSuiteId}/remove',
            ...removeTestRunController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/automations/test-runs/{testSuiteId}/update',
            ...updateTestRunFormController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/automations/test-runs/{testSuiteId}/update',
            ...updateTestRunController
          }
        ].map(adminUserScope)
      )
    }
  }
}

export { serviceAutomations }
