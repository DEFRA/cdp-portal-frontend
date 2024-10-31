import isNull from 'lodash/isNull.js'

import { sessionNames } from '~/src/server/common/constants/session-names.js'

const noSessionRedirect = {
  method: (request, h) => {
    const cdpTeam = request.yar.get(sessionNames.cdpTeam)

    if (isNull(cdpTeam) || cdpTeam?.isComplete?.allSteps) {
      return h.redirect('/admin/teams/create').takeover()
    }

    return h.continue
  }
}

export { noSessionRedirect }
