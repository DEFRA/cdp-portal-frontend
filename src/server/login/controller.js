import { appConfig } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'

const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: async (request, h) => {
    request.yar.set(sessionNames.auth, {
      credentials: {
        token: request.auth.credentials.token,
        profile: request.auth.credentials.profile
      }
    })

    return h.redirect(appConfig.get('appPathPrefix'))
  }
}

export { loginController }
