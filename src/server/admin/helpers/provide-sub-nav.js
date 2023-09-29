import { config } from '~/src/config'

function provideSubNav(request, h) {
  const response = request.response
  const appPathPrefix = config.get('appPathPrefix')

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.subNavigation = [
      {
        isActive:
          request?.path.includes(`${appPathPrefix}/admin/teams`) ?? false,
        url: '/admin/teams',
        label: 'Teams'
      },
      {
        isActive:
          request?.path.includes(`${appPathPrefix}/admin/users`) ?? false,
        url: '/admin/users',
        label: 'Users'
      }
    ]
  }

  return h.continue
}

export { provideSubNav }
