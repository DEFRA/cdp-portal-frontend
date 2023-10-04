import { isEmpty } from 'lodash'

import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'

const noSessionRedirect = {
  method: (request, h) => {
    const deployment = request.yar.get(sessionNames.deployment)

    if (isEmpty(deployment) || deployment?.isComplete?.allSteps) {
      return h
        .redirect(config.get('appPathPrefix') + '/deploy-service')
        .takeover()
    }

    return h.continue
  }
}

export { noSessionRedirect }
