import { isNull } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

const noSessionRedirect = {
  method: (request, h) => {
    const deployment = request.yar.get(sessionNames.deployment)

    if (isNull(deployment) || deployment?.isComplete?.allSteps) {
      return h.redirect('/deploy-service').takeover()
    }

    return h.continue
  }
}

export { noSessionRedirect }
