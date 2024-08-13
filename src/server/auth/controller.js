import Boom from '@hapi/boom'
import { v4 as uuidv4 } from 'uuid'

import {
  createUserSession,
  createTempUserSession
} from '~/src/server/common/helpers/auth/user-session'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { findCdpGithubHandle } from '~/src/server/login/github/helpers/find-cdp-github-handle'

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

      request.logger.info(
        { profile: request.auth.credentials.profile },
        'User logged in'
      )
      const githubHandle = await findCdpGithubHandle(request)

      request.sessionCookie.set({ sessionId })

      const { profile } = request.auth.credentials

      request.audit.sendMessage({
        event: `User logged in ${profile?.id} ${profile?.displayName}`,
        user: profile
      })

      if (!githubHandle) {
        request.logger.debug('User github handle missing')
        await createTempUserSession(request, sessionId)

        return h.redirect('/login/github')
      }

      await createUserSession(request, sessionId)
    }

    const redirect = request.yar.flash(sessionNames.referrer)?.at(0) ?? '/'

    return h.redirect(redirect)
  }
}

export { authCallbackController }
