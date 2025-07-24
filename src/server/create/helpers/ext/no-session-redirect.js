import isNull from 'lodash/isNull.js'

import { sessionNames } from '../../../common/constants/session-names.js'

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
