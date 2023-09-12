import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'
const logger = createLogger()

const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: (request, h) => {
    request.yar.set('auth', request.auth)
    const redirectUrl = appConfig.get('appRedirectUrl')
    logger.info(
      'Attempting to login, redirecting to following url ' + redirectUrl
    )
    return h.redirect(redirectUrl)
  }
}

export { loginController }
