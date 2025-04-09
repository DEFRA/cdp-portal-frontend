// TODO can this be improved?
function provideAutomationSubNavigation(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    const serviceId = response.source?.context?.service?.imageName
    const autoDeploymentsUrl = request.routeLookup(
      'post:services/{serviceId}/automations/deployments',
      { params: { serviceId } }
    )
    const autoTestRunsUrl = request.routeLookup(
      'post:services/{serviceId}/automations/test-runs',
      { params: { serviceId } }
    )

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

  return h.continue
}

export { provideAutomationSubNavigation }
