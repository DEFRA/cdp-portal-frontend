import { isNull } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

const noSessionRedirect = {
  method: (request, h) => {
    const cdpUser = request.yar.get(sessionNames.cdpUser)

    if (isNull(cdpUser) || cdpUser?.isComplete?.allSteps) {
      return h.redirect('/admin/users/create').takeover()
    }

    return h.continue
  }
}

export { noSessionRedirect }
