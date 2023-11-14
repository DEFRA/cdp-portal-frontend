import { isNull } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

const noSessionRedirect = {
  method: (request, h) => {
    const cdpTeam = request.yar.get(sessionNames.cdpTeam)

    if (isNull(cdpTeam)) {
      return h.redirect('/teams').takeover()
    }

    return h.continue
  }
}

export { noSessionRedirect }
