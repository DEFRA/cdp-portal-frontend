import { sessionNames } from '~/src/server/common/constants/session-names'

function provideFormContextValues(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    const deployment = request.yar.get(sessionNames.deployment)
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
    // 2 - values from deployment session
    // 3 - formValues from h.view() context          - (The lowest priority)

    response.source.context.formValues = {
      ...(response.source.context?.formValues &&
        response.source.context.formValues),
      ...(deployment && deployment),
      ...(validationFailure?.formValues && validationFailure.formValues)
    }

    if (validationFailure?.formErrors) {
      response.source.context.formErrors = validationFailure?.formErrors
    }

    // Override order:
    // 1 - availableVersionOptions from validationFailure session - (The highest priority)
    // 2 - availableVersionOptions from h.view() context          - (The lowest priority)

    response.source.context.availableVersionOptions = [
      ...(validationFailure?.availableVersionOptions
        ? validationFailure.availableVersionOptions
        : response.source.context?.availableVersionOptions
          ? response.source.context.availableVersionOptions
          : [])
    ]

    // Override order:
    // 1 - availableMemoryOptions from validationFailure session - (The highest priority)
    // 2 - availableMemoryOptions from h.view() context          - (The lowest priority)

    response.source.context.availableMemoryOptions = [
      ...(validationFailure?.availableMemoryOptions
        ? validationFailure.availableMemoryOptions
        : response.source.context?.availableMemoryOptions
          ? response.source.context.availableMemoryOptions
          : [])
    ]
  }

  return h.continue
}

export { provideFormContextValues }
