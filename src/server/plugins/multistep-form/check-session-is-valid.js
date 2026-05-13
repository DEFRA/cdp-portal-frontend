import isNull from 'lodash/isNull.js'

import { populatePathParams } from './populate-path-params.js'

/**
 * Check that the multistep form session is valid. If a user lands in the multistep form flow without the appropriate
 * session send them back to the start page
 * @param {Record<string, string>} urlTemplates - flow url templates
 * @returns {(function(*, *): (*))|*}
 */
function checkSessionIsValid(urlTemplates) {
  return (request, h) => {
    const multiStepFormId = request.app.multiStepFormId
    const stepData = request.yar.get(multiStepFormId)
    const multiStepFormStartUrl = populatePathParams(
      request.params,
      urlTemplates.stepOne
    )

    if (isNull(stepData) && request.path !== multiStepFormStartUrl) {
      return h.redirect(multiStepFormStartUrl).takeover()
    }

    return h.continue
  }
}

export { checkSessionIsValid }
