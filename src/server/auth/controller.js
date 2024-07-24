import Boom from '@hapi/boom'
import { v4 as uuidv4 } from 'uuid'

import { createUserSession } from '~/src/server/common/helpers/auth/user-session'
import { sessionNames } from '~/src/server/common/constants/session-names'

const authCallbackController = {
  options: {
    auth: 'azure-oidc',
    response: {
      failAction: () => Boom.boomify(Boom.unauthorized())
    }
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const sessionId = uuidv4()

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
