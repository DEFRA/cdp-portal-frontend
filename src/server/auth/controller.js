import { randomUUID } from 'node:crypto'

import Boom from '@hapi/boom'

import { createUserSession } from '../common/helpers/auth/user-session.js'
import { sessionNames } from '../common/constants/session-names.js'
import { redirectWithRefresh } from '../common/helpers/url/url-helpers.js'
import { fetchScopes } from '../teams/helpers/fetch/fetch-scopes.js'

const authCallbackController = {
  options: {
    auth: 'azure-oidc',
    response: {
      failAction: () => Boom.boomify(Boom.unauthorized())
    }
  },
  handler: async (request, h) => {
    const { auth, sessionCookie, audit, yar, logger } = request
    let userSession

    if (auth.isAuthenticated) {
      const sessionId = randomUUID()

      logger.info('Creating user session')
      userSession = await createUserSession(request, sessionId)

      sessionCookie.set({ sessionId })
      const loginMsg = `User logged in UserId: ${userSession.id} displayName: ${userSession.displayName}`
      request.logger.info(loginMsg)

      audit.sendMessage({
        event: loginMsg,
        user: userSession
      })
    }

    let redirect = yar.flash(sessionNames.referrer)?.at(0) ?? '/'

    if (userSession && redirect === '/services') {
      const { scopeFlags } = await fetchScopes(userSession.token)
      if (scopeFlags?.isAdmin) {
        redirect = '/services/all'
      }
    }

    logger.info(`Login complete, redirecting user to ${redirect}`)
    return redirectWithRefresh(h, redirect)
  }
}

export { authCallbackController }
