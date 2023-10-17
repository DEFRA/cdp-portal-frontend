import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToDeployment } from '~/src/server/deploy-service/helpers/form'

const startDeployServiceController = {
  handler: async (request, h) => {
    request.yar.clear(sessionNames.deployment)
    request.yar.clear(sessionNames.validationFailure)

    await saveToDeployment(request, h, {})

    return h.redirect(config.get('appPathPrefix') + '/deploy-service/details')
  }
}

export { startDeployServiceController }
