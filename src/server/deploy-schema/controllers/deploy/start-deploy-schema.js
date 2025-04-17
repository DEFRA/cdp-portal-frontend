import qs from 'qs'

import { sessionNames } from '~/src/server/common/constants/session-names.js'

const startDeploySchemaController = {
  options: {
    id: 'deploy-schema'
  },
  handler: (request, h) => {
    const query = request.yar.flash(sessionNames.query)?.at(0)

    request.yar.clear(sessionNames.validationFailure)
    request.yar.clear(sessionNames.query)

    return h.redirect(
      '/deploy-schema/details' + qs.stringify(query, { addQueryPrefix: true })
    )
  }
}

export { startDeploySchemaController }
