import { randomUUID } from 'node:crypto'

import Boom from '@hapi/boom'

import { createUserSession } from '~/src/server/common/helpers/auth/user-session.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'

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

      await createUserSession(request, sessionId)

      request.sessionCookie.set({ sessionId })

      const { profile } = request.auth.credentials

      request.audit.sendMessage({
        event: `User logged in ${profile?.id} ${profile?.displayName}`,
        user: profile
      })
    }

    const redirect = request.yar.flash(sessionNames.referrer)?.at(0) ?? '/'

    return h.redirect(redirect)
  }
}

export { authCallbackController }
