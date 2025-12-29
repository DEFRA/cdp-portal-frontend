function provideSubNavigation(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    const { path } = request
    const isStyles = path.startsWith('/style-guide/styles')
    const isIcons = path.startsWith('/style-guide/icons')
    const isSvgs = path.startsWith('/style-guide/svgs')
    const isComponents =
      path.startsWith('/style-guide') && !isStyles && !isIcons && !isSvgs

    response.source.context.subNavigation = [
      {
        isActive: isComponents,
        url: '/style-guide',
        label: { text: 'Components' }
      },
      {
        isActive: isStyles,
        url: '/style-guide/styles',
        label: { text: 'Styles' }
      },
      {
        isActive: isIcons,
        url: '/style-guide/icons',
        label: { text: 'Icons' }
      },
      {
        isActive: isSvgs,
        url: '/style-guide/svgs',
        label: { text: 'SVGs' }
      }
    ]
  }

  return h.continue
}

export { provideSubNavigation }
