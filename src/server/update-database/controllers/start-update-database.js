import qs from 'qs'

import { sessionNames } from '~/src/server/common/constants/session-names.js'

const startUpdateDatabaseController = {
  options: {
    id: 'update-database'
  },
  handler: (request, h) => {
    const query = request.yar.flash(sessionNames.query)?.at(0)

    request.yar.clear(sessionNames.validationFailure)
    request.yar.clear(sessionNames.query)

    return h.redirect(
      '/update-database/change-details' +
        qs.stringify(query, { addQueryPrefix: true })
    )
  }
}

export { startUpdateDatabaseController }
