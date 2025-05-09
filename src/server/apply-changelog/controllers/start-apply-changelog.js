import qs from 'qs'

import { sessionNames } from '~/src/server/common/constants/session-names.js'

const startApplyChangelogController = {
  options: {
    id: 'apply-changelog'
  },
  handler: (request, h) => {
    const query = request.yar.flash(sessionNames.query)?.at(0)

    request.yar.clear(sessionNames.validationFailure)
    request.yar.clear(sessionNames.query)

    return h.redirect(
      '/apply-changelog/change-details' +
        qs.stringify(query, { addQueryPrefix: true })
    )
  }
}

export { startApplyChangelogController }
