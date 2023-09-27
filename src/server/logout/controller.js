import { appConfig } from '~/src/config'
import { provideUser } from '~/src/server/logout/prerequisites/provide-user'
import { sessionNames } from '~/src/server/common/constants/session-names'

const logoutController = {
  options: {
    pre: [provideUser]
  },
  handler: async (request, h) => {
    const referrer = request.info.referrer
    const loginHint = request.pre.user.loginHint
    const azureTenantId = appConfig.get('azureTenantId')

    const logoutUrl = encodeURI(
      `https://login.microsoftonline.com/${azureTenantId}/oauth2/logout?logout_hint=${loginHint}&post_logout_redirect_uri=${referrer}`
    )

    request.yar.clear(sessionNames.user)
    request.cookieAuth.clear()

    return h.redirect(logoutUrl)
  }
}

export { logoutController }
