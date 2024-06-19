import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'
import { removeAuthenticatedUser } from '~/src/server/common/helpers/auth/user-session'
import { provideCdpRequestId } from '~/src/server/common/helpers/audit/pre/provide-cdp-request-id'

const logoutController = {
  options: {
    pre: [provideAuthedUser, provideCdpRequestId]
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

    await request.audit.send(
      request.pre?.cdpRequestId,
      `User logged out ${authedUser?.id} ${authedUser?.displayName}`
    )
    return h.redirect(logoutUrl)
  }
}

export { logoutController }
