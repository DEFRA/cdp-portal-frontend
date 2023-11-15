function provideSubNav(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.subNavigation = [
      {
        isActive: request?.path.includes('/admin/teams') ?? false,
        url: '/admin/teams',
        label: 'Teams'
      },
      {
        isActive: request?.path.includes('/admin/users') ?? false,
        url: '/admin/users',
        label: 'Users'
      }
    ]
  }

  return h.continue
}

export { provideSubNav }
