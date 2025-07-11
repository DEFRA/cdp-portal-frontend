function provideSubNavigation(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.subNavigation = [
      {
        isActive: request.path.startsWith('/admin/users'),
        url: '/admin/users',
        label: {
          text: 'Users'
        }
      },
      {
        isActive: request.path.startsWith('/admin/teams'),
        url: '/admin/teams',
        label: {
          text: 'Teams'
        }
      },
      {
        isActive: request.path.startsWith('/admin/features'),
        url: '/admin/features',
        label: {
          text: 'Feature Toggles'
        }
      },
      {
        isActive: request.path.startsWith('/admin/permissions'),
        url: '/admin/permissions',
        label: {
          text: 'Permissions'
        }
      },
      {
        isActive: request.path.startsWith('/admin/tags'),
        url: '/admin/tags',
        label: {
          text: 'Service tags'
        }
      },
      {
        isActive: request.path.startsWith('/admin/decommissions'),
        url: '/admin/decommissions',
        label: {
          text: 'Decommissions'
        }
      }
    ]
  }

  return h.continue
}

export { provideSubNavigation }
