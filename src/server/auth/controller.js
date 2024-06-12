import Boom from '@hapi/boom'
import { v4 as uuidv4 } from 'uuid'

import { createUserSession } from '~/src/server/common/helpers/auth/user-session'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideCdpRequestId } from '~/src/server/common/helpers/audit/pre/provide-cdp-request-id'

const authCallbackController = {
  options: {
    auth: 'azure-oidc',
    response: {
      failAction: () => Boom.boomify(Boom.unauthorized())
    },
    pre: [provideCdpRequestId]
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const sessionId = uuidv4()

      await createUserSession(request, sessionId)

      const { profile } = request.auth.credentials
      request.sessionCookie.set({ sessionId })
      await request.audit.send(
        request.pre?.cdpRequestId,
        `Successful login for ${profile.id} (${profile.displayName})}`
      )
    }

    const redirect = request.yar.flash(sessionNames.referrer)?.at(0) ?? '/'

    return h.redirect(redirect)
  }
}

export { authCallbackController }
