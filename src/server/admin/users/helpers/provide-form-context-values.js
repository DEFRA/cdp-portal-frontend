import { sessionNames } from '~/src/server/common/constants/session-names'

function provideFormContextValues(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    const cdpUser = request.yar.get(sessionNames.cdpUser)
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
    // 2 - values from cdpUser session
    // 3 - formValues from h.view() context          - (The lowest priority)

    response.source.context.formValues = {
      ...(response.source.context?.formValues &&
        response.source.context.formValues),
      ...(cdpUser && cdpUser),
      ...(validationFailure?.formValues && validationFailure.formValues)
    }

    if (validationFailure?.formErrors) {
      response.source.context.formErrors = validationFailure?.formErrors
    }
  }

  return h.continue
}

export { provideFormContextValues }
