import { randomUUID } from 'node:crypto'

import Boom from '@hapi/boom'

import { createUserSession } from '../common/helpers/auth/user-session.js'
import { sessionNames } from '../common/constants/session-names.js'
import { redirectWithRefresh } from '../common/helpers/url/url-helpers.js'

const authCallbackController = {
  options: {
    auth: 'azure-oidc',
    response: {
      failAction: () => Boom.boomify(Boom.unauthorized())
    }
  },
  handler: async (request, h) => {
    const { auth, sessionCookie, audit, yar, logger } = request
    if (auth.isAuthenticated) {
      const sessionId = randomUUID()

      logger.info('Creating user session')
      await createUserSession(request, sessionId)

      sessionCookie.set({ sessionId })
      const userSession = auth.credentials

      const loginMsg = `User logged in ${userSession.id} ${userSession.displayName}`
      request.logger.info(loginMsg)

      audit.sendMessage({
        event: loginMsg,
        user: userSession
      })
    }

    const redirect = yar.flash(sessionNames.referrer)?.at(0) ?? '/'
    logger.info(`Login complete, redirecting user to ${redirect}`)
    return redirectWithRefresh(h, redirect)
  }
}

export { authCallbackController }
