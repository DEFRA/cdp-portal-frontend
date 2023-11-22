import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'

const logoutController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser

    if (!authedUser) {
      return h.redirect('/')
    }

    const logoutBaseUrl = request.oidc.end_session_endpoint
    const referrer = request.info.referrer
    const loginHint = authedUser.loginHint

    const logoutUrl = encodeURI(
      `${logoutBaseUrl}?logout_hint=${loginHint}&post_logout_redirect_uri=${referrer}`
    )

    request.dropUserSession()
    request.cookieAuth.clear()

    return h.redirect(logoutUrl)
  }
}

export { logoutController }
