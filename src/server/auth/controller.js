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
    if (request.auth.isAuthenticated) {
      const sessionId = randomUUID()

      request.logger.info('Creating user session')
      await createUserSession(request, sessionId)

      request.sessionCookie.set({ sessionId })
      const userSession = request.auth.credentials

      request.audit.sendMessage({
        event: `User logged in ${userSession?.id} ${userSession?.displayName}`,
        user: userSession
      })
    }

    const redirect = request.yar.flash(sessionNames.referrer)?.at(0) ?? '/'
    request.logger.info(`Login complete, redirecting user to ${redirect}`)
    return redirectWithRefresh(h, redirect)
  }
}

export { authCallbackController }
