import { config } from '~/src/config'
import { provideUser } from '~/src/server/logout/prerequisites/provide-user'
import { sessionNames } from '~/src/server/common/constants/session-names'

const logoutController = {
  options: {
    pre: [provideUser]
  },
  handler: async (request, h) => {
    const user = request.pre.user

    if (!user) {
      return h.redirect(config.get('appPathPrefix'))
    }

    const referrer = request.info.referrer
    const loginHint = user.loginHint
    const azureTenantId = config.get('azureTenantId')

    const logoutUrl = encodeURI(
      `https://login.microsoftonline.com/${azureTenantId}/oauth2/logout?logout_hint=${loginHint}&post_logout_redirect_uri=${referrer}`
    )

    request.yar.clear(sessionNames.user)
    await request.server.yar.revoke(request.yar.id)
    request.cookieAuth.clear()

    return h.redirect(logoutUrl)
  }
}

export { logoutController }
