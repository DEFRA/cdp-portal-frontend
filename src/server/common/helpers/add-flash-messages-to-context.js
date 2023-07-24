function addFlashMessagesToContext(request, h) {
  const response = request.response

  if (response.variety === 'view') {
    response.source.context = {
      ...response.source.context,
      notifications: request.yar.flash('notifications')
    }
  }

  return h.continue
}

export { addFlashMessagesToContext }
