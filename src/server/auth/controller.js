import { randomUUID } from 'node:crypto'

import Boom from '@hapi/boom'
import { sessionNames } from '../common/constants/session-names.js'
import { saveUserSession } from '#server/common/helpers/auth/save-session.js'
import { redirectWithRefresh } from '#server/common/helpers/url/url-helpers.js'
import { fetchScopes } from '#server/teams/helpers/fetch/fetch-scopes.js'

export const authCallbackController = {
  options: {
    auth: 'azure-oidc',
    response: {
      failAction: () => Boom.unauthorized()
    }
  },
  handler: async (request, h) => {
    const { auth, sessionCookie, audit, yar, logger } = request

    if (!auth.isAuthenticated) {
      throw Boom.unauthorized()
    }

    const sessionId = randomUUID()

    logger.info(`Creating user session ${sessionId}`)
    const session = await saveUserSession(request, sessionId, auth.credentials)

    sessionCookie.set({ sessionId })
    const loginMsg = `User logged in UserId: ${sessionId} displayName: ${session.displayName}`
    logger.info(loginMsg)

    audit.sendMessage({
      event: loginMsg,
      user: session
    })

    let redirect = yar.flash(sessionNames.referrer)?.at(0) ?? '/'
    logger.info(`Login complete, redirecting user to ${redirect}`)

    if (session && redirect === '/services') {
      const { scopeFlags } = await fetchScopes(session.token)
      if (scopeFlags?.isAdmin) {
        redirect = '/services/all'
      }
    }

    return redirectWithRefresh(h, redirect)
  }
}
