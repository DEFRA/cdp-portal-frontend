function provideSubNavigation(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.subNavigation = [
      {
        isActive: request.path.startsWith('/utilities/templates'),
        url: '/utilities/templates',
        label: 'Templates'
      },
      {
        isActive: request.path.startsWith('/utilities/libraries'),
        url: '/utilities/libraries',
        label: 'Libraries'
      }
    ]
  }

  return h.continue
}

export { provideSubNavigation }
