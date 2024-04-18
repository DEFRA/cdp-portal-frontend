import { isNull, size } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

const noSessionRedirect = {
  method: (request, h) => {
    const deployment = request.yar.get(sessionNames.deployment)
    const query = request.query

    if (isNull(deployment) || deployment?.isComplete?.allSteps) {
      if (size(query)) {
        request.yar.flash(sessionNames.query, query)
      }

      return h.redirect('/deploy-service').takeover()
    }

    return h.continue
  }
}

export { noSessionRedirect }
