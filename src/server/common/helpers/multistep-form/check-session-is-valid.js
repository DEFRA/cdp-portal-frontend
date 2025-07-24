import isNull from 'lodash/isNull.js'
import size from 'lodash/size.js'

import { sessionNames } from '../../constants/session-names.js'

/**
 * If the multistep session data does not exist or is marked as complete. Redirect to the start of the flow
 * @param {string} startUrl
 * @returns {{method: ((function(*, *): (*))|*)}}
 */
function checkSessionIsValid(startUrl) {
  return {
    method: (request, h) => {
      const stepData = request.yar.get(request.app?.multiStepFormId)
      const query = request.query

      if (isNull(stepData)) {
        // If there are query params, save them to flash and redirect to the deploy service start endpoint
        if (size(query)) {
          request.yar.flash(sessionNames.query, query)
        }

        return h.redirect(startUrl).takeover()
      }

      return h.continue
    }
  }
}

export { checkSessionIsValid }
