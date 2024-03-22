import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'
import { removeAuthenticatedUser } from '~/src/server/common/helpers/auth/user-session'

const logoutController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: (request, h) => {
    const authedUser = request.pre.authedUser

    if (!authedUser) {
      return h.redirect('/')
    }

    const logoutBaseUrl = request.server.app.oidc.end_session_endpoint
    const referrer = request.info.referrer
    const loginHint = authedUser.loginHint

    const logoutUrl = encodeURI(
      `${logoutBaseUrl}?logout_hint=${loginHint}&post_logout_redirect_uri=${referrer}`
    )

    removeAuthenticatedUser(request)

    return h.redirect(logoutUrl)
  }
}

export { logoutController }
