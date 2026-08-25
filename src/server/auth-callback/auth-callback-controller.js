import { randomUUID } from 'node:crypto'

import Boom from '@hapi/boom'
import { saveUserSession } from '#server/common/helpers/auth/save-session.js'
import { redirectWithRefresh } from '#server/common/helpers/url/url-helpers.js'
import { authCompletePath } from './auth-complete-controller.js'

export const authCallbackController = {
  handler: async (request, h) => {
    const credentials = await request.callback(h)

    if (!credentials) {
      throw Boom.unauthorized()
    }

    const { sessionCookie, audit, logger } = request

    const sessionId = randomUUID()

    logger.info(`Creating user session ${sessionId}`)
    const session = await saveUserSession(request, sessionId, credentials)

    sessionCookie.set({ sessionId })
    const loginMsg = `User logged in UserId: ${sessionId} displayName: ${session.displayName}`
    logger.info(loginMsg)

    request.auth.credentials = credentials
    audit.sendMessage({
      event: loginMsg,
      user: session
    })

    // Under response_mode=form_post the provider returns here as a cross-site
    // POST, so the browser sends no SameSite=Lax cookie and the session holding
    // the return path is unreachable. Reading it here would also mint a fresh
    // session and orphan the original, so hand off to a same-site GET instead.
    return redirectWithRefresh(h, authCompletePath)
  }
}
