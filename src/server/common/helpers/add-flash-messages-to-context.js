import { sessionNames } from '~/src/server/common/constants/session-names'

async function addFlashMessagesToContext(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    const notifications = request.yar.flash(sessionNames.notifications)
    await request.yar.commit(h)

    response.source.context = {
      ...response.source.context,
      notifications,
      globalValidationFailures: request.yar.flash(
        sessionNames.globalValidationFailures
      )
    }
  }

  return h.continue
}

export { addFlashMessagesToContext }
