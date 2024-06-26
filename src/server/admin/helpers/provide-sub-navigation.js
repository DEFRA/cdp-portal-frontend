function provideSubNavigation(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.subNavigation = [
      {
        isActive: request.path.startsWith('/admin/teams'),
        url: '/admin/teams',
        label: 'Teams'
      },
      {
        isActive: request.path.startsWith('/admin/users'),
        url: '/admin/users',
        label: 'Users'
      }
    ]
  }

  return h.continue
}

export { provideSubNavigation }
