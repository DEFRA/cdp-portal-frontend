import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { autoTestRunsController } from '~/src/server/services/service/automations/controllers/auto-test-runs.js'
import { autoDeploymentsController } from '~/src/server/services/service/automations/controllers/auto-deployments.js'
import { setupAutoTestRunController } from '~/src/server/services/service/automations/controllers/create-auto-test-runs.js'
import { setupAutoDeployController } from '~/src/server/services/service/automations/controllers/save-auto-deployments.js'
import { provideAutomationSubNavigation } from '~/src/server/services/service/automations/helpers/provide-sub-navigation.js'
import { removeTestRunFormController } from '~/src/server/services/service/automations/controllers/remove/remove-test-run-form.js'
import { removeTestRunController } from '~/src/server/services/service/automations/controllers/remove/remove-test-run.js'
import { updateTestRunFormController } from '~/src/server/services/service/automations/controllers/update/update-test-run-form.js'
import { updateTestRunController } from '~/src/server/services/service/automations/controllers/update/update-test-run.js'

// TODO - automation currently feature flagged as admin only, switch to admin and serviceOwner once ready
const adminUserScope = authScope([
  scopes.admin
  // scopes.serviceOwner,
])

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
        // TODO improve
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
