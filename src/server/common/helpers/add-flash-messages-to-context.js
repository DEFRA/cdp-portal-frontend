import { sessionNames } from '~/src/server/common/constants/session-names'

function addFlashMessagesToContext(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    response.source.context = {
      ...response.source.context,
      notifications: request.yar.flash(sessionNames.notifications),
      globalValidationFailures: request.yar.flash(
        sessionNames.globalValidationFailures
      )
    }
  }

  return h.continue
}

export { addFlashMessagesToContext }
