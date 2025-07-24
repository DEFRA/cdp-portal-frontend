import qs from 'qs'

import { sessionNames } from '../../../common/constants/session-names.js'

const startDeployServiceController = {
  options: {
    id: 'deploy-service'
  },
  handler: (request, h) => {
    const query = request.yar.flash(sessionNames.query)?.at(0)

    request.yar.clear(sessionNames.validationFailure)
    request.yar.clear(sessionNames.query)

    return h.redirect(
      '/deploy-service/details' + qs.stringify(query, { addQueryPrefix: true })
    )
  }
}

export { startDeployServiceController }
