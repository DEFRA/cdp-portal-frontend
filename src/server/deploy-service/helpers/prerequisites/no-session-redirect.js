import { isNull } from 'lodash'

import { appConfig } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'

const noSessionRedirect = {
  method: (request, h) => {
    const deployment = request.yar.get(sessionNames.deployment)

    if (isNull(deployment) || deployment?.isComplete) {
      return h
        .redirect(`${appConfig.get('appPathPrefix')}/deploy-service`)
        .takeover()
    }

    return h.continue
  }
}

export { noSessionRedirect }
