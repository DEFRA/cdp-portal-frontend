import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { removeAuthenticatedUser } from '~/src/server/common/helpers/auth/user-session.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'
import { config } from '~/src/config/config.js'

const logoutController = {
  options: {
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser

    if (!authedUser) {
      return h.redirect('/')
    }

    const { payload } = await fetchJson(
      config.get('oidcWellKnownConfigurationUrl')
    )

    const logoutBaseUrl = payload.end_session_endpoint
    const referrer = request.info.referrer
    const loginHint = authedUser.loginHint

    const logoutUrl = encodeURI(
      `${logoutBaseUrl}?logout_hint=${loginHint}&post_logout_redirect_uri=${referrer}`
    )

    removeAuthenticatedUser(request)

    request.audit.sendMessage({
      event: `User logged out ${authedUser?.id} ${authedUser?.displayName}`,
      user: authedUser
    })
    return h.redirect(logoutUrl)
  }
}

export { logoutController }
