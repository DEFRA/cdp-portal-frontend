import { isNull } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

const noSessionRedirect = {
  method: (request, h) => {
    const create = request.yar.get(sessionNames.create)

    if (isNull(create) || create?.isComplete?.allSteps) {
      return h.redirect('/create').takeover()
    }

    return h.continue
  }
}

export { noSessionRedirect }
