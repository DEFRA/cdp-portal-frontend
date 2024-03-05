async function provideTabs(request, h) {
  const authedUser = await request.getUserSession()
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.tabs = [
      {
        isActive: request.path.startsWith('/deployments/dev'),
        url: '/deployments/dev',
        label: 'Dev'
      },
      {
        isActive: request.path.startsWith('/deployments/test'),
        url: '/deployments/test',
        label: 'Test'
      },
      {
        isActive: request.path.startsWith('/deployments/perf-test'),
        url: '/deployments/perf-test',
        label: 'Perf-test'
      },
      {
        isActive: request.path.startsWith('/deployments/prod'),
        url: '/deployments/prod',
        label: 'Prod'
      }
    ]

    if (authedUser?.isAdmin) {
      response.source.context.tabs.unshift(
        {
          isActive: request.path.startsWith('/deployments/infra-dev'),
          url: '/deployments/infra-dev',
          label: 'Infra-dev'
        },
        {
          isActive: request.path.startsWith('/deployments/management'),
          url: '/deployments/management',
          label: 'Management'
        }
      )
    }
  }

  return h.continue
}

export { provideTabs }
