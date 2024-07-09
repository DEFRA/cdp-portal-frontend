import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'
import { removeAuthenticatedUser } from '~/src/server/common/helpers/auth/user-session'

const logoutController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
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

    request.audit.send(
      `User logged out ${authedUser?.id} ${authedUser?.displayName}`
    )
    return h.redirect(logoutUrl)
  }
}

export { logoutController }
