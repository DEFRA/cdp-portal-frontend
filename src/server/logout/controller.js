import { appConfig } from '~/src/config'
import { provideAuth } from '~/src/server/logout/prerequisites/provide-auth'
import { sessionNames } from '~/src/server/common/constants/session-names'

const logoutController = {
  options: {
    pre: [provideAuth]
  },
  handler: async (request, h) => {
    const appBaseUrl =
      appConfig.get('appBaseUrl') + appConfig.get('appPathPrefix')

    const logoutUrl = encodeURI(
      `https://login.microsoftonline.com/${appConfig.get(
        'azureTenantId'
      )}/oauth2/logout?logout_hint=${
        request.pre.auth.credentials.profile.loginHint
      }&post_logout_redirect_uri=${appBaseUrl}`
    )

    request.yar.clear(sessionNames.auth)

    return h.redirect(logoutUrl)
  }
}

export { logoutController }
