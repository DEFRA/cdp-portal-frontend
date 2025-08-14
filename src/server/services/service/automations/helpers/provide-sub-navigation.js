function provideAutomationSubNavigation(request, h) {
  const entity = request.app.entity
  const isTestSuiteOrMicroservice =
    entity?.type === 'Microservice' || entity?.type === 'TestSuite'

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

    if (isTestSuiteOrMicroservice) {
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
