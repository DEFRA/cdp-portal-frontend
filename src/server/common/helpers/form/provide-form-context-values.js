import { pickBy } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

function provideFormContextValues(sessionName = null) {
  return (request, h) => {
    const response = request.response

    if (response.variety === 'view') {
      const sessionValue = sessionName && request.yar.get(sessionName)
      const validationFailure = request.yar
        .flash(sessionNames.validationFailure)
        ?.at(0)

      if (!response.source?.context) {
        response.source.context = {}
      }

      if (validationFailure) {
        response.source.context.isError = true
      }

      // Override order for formValues:
      // 1 - formValues from validationFailure session - (The highest priority)
      // 2 - if sessionValue exists, values from sessionValue
      // 3 - formValues from h.view() context          - (The lowest priority)

      response.source.context.formValues = {
        ...(response.source.context?.formValues &&
          response.source.context.formValues),
        ...(sessionValue && pickBy(sessionValue)),
        ...(validationFailure?.formValues && validationFailure.formValues)
      }

      if (validationFailure?.formErrors) {
        response.source.context.formErrors = validationFailure?.formErrors
      }
    }

    return h.continue
  }
}

export { provideFormContextValues }
