async function buildNavigation(request) {
  const authedUser = await request.getUserSession()

  return {
    primary: [
      {
        text: 'Home',
        url: '/',
        isActive: request?.path === '/'
      },
      {
        text: 'Services',
        url: '/services',
        isActive: request?.path?.includes('/services')
      },
      {
        text: 'Utilities',
        url: '/utilities/templates',
        isActive: request?.path?.includes('/utilities')
      },
      {
        text: 'Teams',
        url: '/teams',
        isActive: request?.path?.includes('/teams')
      },
      {
        text: 'Deployments',
        url: '/deployments',
        isActive: request?.path?.includes('/deployments')
      },
      {
        text: 'Running Services',
        url: '/running-services',
        isActive: request?.path?.includes('/running-services')
      }
    ],
    actions: authedUser?.isServiceTeamUser && [
      {
        text: 'Deploy Service',
        url: '/deploy-service',
        isActive: request?.path?.includes('/deploy-service')
      },
      {
        text: 'Create Service',
        url: '/create-service',
        isActive: request?.path?.includes('/create-service')
      }
    ],
    admin: authedUser?.isAdmin && [
      {
        text: 'Admin',
        url: '/admin',
        isActive: request?.path?.includes('/admin')
      }
    ]
  }
}

export { buildNavigation }
