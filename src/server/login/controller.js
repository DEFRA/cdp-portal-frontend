import { appConfig } from '~/src/config'
import { createLogger } from '~/src/server/common/helpers/logger'

const logger = createLogger()
const loginController = {
  options: {
    auth: 'azure-oidc'
  },
  handler: (request, h) => {
    logger.info('Attempting to login')
    request.yar.set('auth', request.auth)
    return h.redirect(appConfig.get('appPathPrefix'))
  }
}

export { loginController }
