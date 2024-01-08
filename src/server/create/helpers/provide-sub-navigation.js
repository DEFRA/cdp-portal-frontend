function provideSubNavigation(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.subNavigation = [
      {
        isActive: request.path.startsWith('/create/'),
        url: '/create',
        label: 'Create'
      },
      {
        isActive: request.path.startsWith('/create-status'),
        url: '/create-status',
        label: 'Status'
      }
    ]
  }

  return h.continue
}

export { provideSubNavigation }
