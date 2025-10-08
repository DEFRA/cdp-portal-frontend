import { entitySubTypes, entityTypes } from '@defra/cdp-validation-kit'

function provideAutomationSubNavigation(request, h) {
  const entity = request.app.entity
  const isTestSuite = entity?.type === entityTypes.testSuite
  const isFrontend =
    entity?.type === entityTypes.microservice &&
    entity?.subType === entitySubTypes.frontend
  const isBackend =
    entity?.type === entityTypes.microservice &&
    entity?.subType === entitySubTypes.backend

  const response = request.response

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    const serviceId = request.app.entity?.name
    const autoDeploymentsUrl = request.routeLookup(
      'post:services/{serviceId}/automations/deployments',
      { params: { serviceId } }
    )
    const autoTestRunsUrl = request.routeLookup(
      'post:services/{serviceId}/automations/test-runs',
      { params: { serviceId } }
    )

    if (isTestSuite || isFrontend || isBackend) {
      response.source.context.subNavigation = [
        {
          isActive: request.path.includes('automations/deployments'),
          url: autoDeploymentsUrl,
          label: { text: 'Deployments' }
        },
        {
          isActive: request.path.includes('automations/test-runs'),
          url: autoTestRunsUrl,
          label: { text: 'Test Runs' }
        }
      ]
    }
  }

  return h.continue
}

export { provideAutomationSubNavigation }
