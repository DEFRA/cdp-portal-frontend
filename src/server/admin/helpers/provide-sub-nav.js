import { appConfig } from '~/src/config'

function provideSubNav(request, h) {
  const response = request.response
  const appPathPrefix = appConfig.get('appPathPrefix')

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.subNavigation = [
      {
        isActive:
          request?.path.includes(`${appPathPrefix}/admin/users`) ?? false,
        url: `${appPathPrefix}/admin/users`,
        label: 'Users'
      },
      {
        isActive:
          request?.path.includes(`${appPathPrefix}/admin/teams`) ?? false,
        url: `${appPathPrefix}/admin/teams`,
        label: 'Teams'
      }
    ]
  }

  return h.continue
}

export { provideSubNav }
