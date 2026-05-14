import { fetchJson } from '../common/helpers/fetch/fetch-json.js'
import { config } from '#config/config.js'
import { removeAuthenticatedUser } from '#server/common/helpers/auth/remove-authenticated-user.js'

const logoutController = {
  handler: async (request, h) => {
    const userSession = request.auth.credentials

    if (!userSession) {
      return h.redirect('/')
    }
    const discoveryUri = config.get('oidc.discoveryUri')

    const { payload } = await fetchJson(discoveryUri)

    const logoutBaseUrl = payload.end_session_endpoint
    const referrer = request.info.referrer
    const loginHint = userSession?.loginHint

    const logoutUrl = encodeURI(
      `${logoutBaseUrl}?logout_hint=${loginHint}&post_logout_redirect_uri=${referrer}`
    )

    removeAuthenticatedUser(request)

    request.audit.sendMessage({
      event: `User logged out ${userSession?.id} ${userSession?.displayName}`,
      user: userSession
    })
    return h.redirect(logoutUrl)
  }
}

export { logoutController }
