import qs from 'qs'

import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToDeployment } from '~/src/server/deploy-service/helpers/form'

const startDeployServiceController = {
  handler: async (request, h) => {
    const query = request.yar.flash(sessionNames.query)?.at(0)

    request.yar.clear(sessionNames.deployment)
    request.yar.clear(sessionNames.validationFailure)
    request.yar.clear(sessionNames.query)

    await saveToDeployment(request, h, {})

    return h.redirect(
      '/deploy-service/details' + qs.stringify(query, { addQueryPrefix: true })
    )
  }
}

export { startDeployServiceController }
