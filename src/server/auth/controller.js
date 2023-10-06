import { addSeconds } from 'date-fns'

import { sessionNames } from '~/src/server/common/constants/session-names'
import { config } from '~/src/config'

const authCallbackController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: (request, h) => {
    if (request.auth.isAuthenticated) {
      request.logger.info('User has been successfully authenticated')

      const { profile } = request.auth.credentials
      const expiresIn = request.auth.credentials.expiresIn
      const expires = addSeconds(new Date(), expiresIn)

      request.yar.set(sessionNames.user, {
        id: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        loginHint: profile.loginHint,
        isAuthenticated: request.auth.isAuthenticated,
        token: request.auth.credentials.token,
        refreshToken: request.auth.credentials.refreshToken
      })

      const isAdmin = profile.groups.includes(config.get('azureAdminGroupId'))
      const userGroups = profile.groups

      request.cookieAuth.set({
        isAdmin,
        scope: userGroups,
        expires
      })

      request.logger.info(`Admin groups is: ${config.get('azureAdminGroupId')}`)
      request.logger.info(`User is admin: ${isAdmin}`)
      request.logger.info(`User groups are: ${userGroups.join(', ')}`)
    }

    const redirect =
      request.yar.flash('referrer')?.at(0) ?? config.get('appPathPrefix')

    return h.redirect(redirect)
  }
}

export { authCallbackController }
