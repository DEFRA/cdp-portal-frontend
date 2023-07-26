import { isNull } from 'lodash'

import { appConfig } from '~/src/config'

const noSessionRedirect = {
  method: (request, h) => {
    const deployment = request.yar.get('deployment')

    if (isNull(deployment) || deployment?.isComplete) {
      return h
        .redirect(`${appConfig.get('appPathPrefix')}/deploy-service`)
        .takeover()
    }

    return h.continue
  }
}

export { noSessionRedirect }
