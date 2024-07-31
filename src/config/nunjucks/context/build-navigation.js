async function buildNavigation(request) {
  const authedUser = await request.getUserSession()

  return {
    primary: [
      {
        text: 'Home',
        url: request.routeLookup('home'),
        isActive: request?.path === '/'
      },
      {
        text: 'Services',
        url: '/services',
        isActive: request?.path?.includes('/services')
      },
      {
        text: 'Test suites',
        url: '/test-suites',
        isActive: request?.path?.includes('/test-suites')
      },
      {
        text: 'Utilities',
        url: '/utilities/templates',
        isActive: request?.path?.includes('/utilities')
      },
      {
        text: 'Teams',
        url: '/teams',
        isActive:
          request?.path?.includes('/teams') && !request?.path?.includes('admin')
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
    actions: (authedUser?.isTenant || authedUser?.isAdmin) && [
      {
        text: 'Deploy Service',
        url: '/deploy-service',
        isActive: request?.path?.includes('/deploy-service')
      },
      {
        text: 'Create',
        url: '/create',
        isActive: request?.path?.includes('/create/')
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
