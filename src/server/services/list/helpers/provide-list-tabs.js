async function provideListTabs(request, h) {
  const userSession = request?.auth?.credentials
  const isAuthenticated = userSession?.isAuthenticated
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.tabDetails = {
      label: 'Services Lists tabs'
    }

    if (!isAuthenticated) {
      response.source.context.tabDetails.tabs = [
        {
          isActive: request.path === '/services',
          url: request.routeLookup('services'),
          label: 'All Services'
        }
      ]
      response.source.context.tabDetails.displayTabs = false
    } else {
      response.source.context.tabDetails.tabs = [
        {
          isActive: request.path === '/services',
          url: request.routeLookup('services'),
          label: 'My Services'
        },
        {
          isActive: request.path === '/services/all',
          url: request.routeLookup('services/all'),
          label: 'All Services'
        }
      ]
    }
  }

  return h.continue
}

export { provideListTabs }
