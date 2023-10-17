import { config } from '~/src/config'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/prerequisites/provide-authed-user'

const logoutController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser

    if (!authedUser) {
      return h.redirect(config.get('appPathPrefix'))
    }

    const referrer = request.info.referrer
    const loginHint = authedUser.loginHint
    const azureTenantId = config.get('azureTenantId')

    const logoutUrl = encodeURI(
      `https://login.microsoftonline.com/${azureTenantId}/oauth2/logout?logout_hint=${loginHint}&post_logout_redirect_uri=${referrer}`
    )

    request.dropUserSession()
    request.cookieAuth.clear()

    return h.redirect(logoutUrl)
  }
}

export { logoutController }
