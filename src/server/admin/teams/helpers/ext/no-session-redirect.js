import { isNull } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

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
