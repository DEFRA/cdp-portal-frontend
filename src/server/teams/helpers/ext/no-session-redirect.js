import isNull from 'lodash/isNull.js'

import { sessionNames } from '../../../common/constants/session-names.js'

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
