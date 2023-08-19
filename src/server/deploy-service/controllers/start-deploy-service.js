import { appConfig } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'

const startDeployServiceController = {
  handler: (request, h) => {
    request.yar.clear(sessionNames.deployment)
    request.yar.clear(sessionNames.validationFailure)
    request.yar.commit(h)

    return h.redirect(
      `${appConfig.get('appPathPrefix')}/deploy-service/details`
    )
  }
}

export { startDeployServiceController }
