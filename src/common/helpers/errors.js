function statusCodeMessage(statusCode) {
  switch (true) {
    case statusCode === 404:
      return 'Page not found'
    case statusCode === 401:
      return 'Forbidden'
    case statusCode === 400:
      return 'Bad Request'
    default:
      return 'Something went wrong'
  }
}

function catchAll(request, h) {
  const { response } = request

  // TODO remove 401 bypass, this is to allow basic auth to show browser login form
  if (!response.isBoom || response.output.statusCode === 401) {
    return h.continue
  }

  request.logger.error(response.message)

  const statusCode = response.output.statusCode
  const errorMessage = statusCodeMessage(statusCode)

  return h
    .view('error/index', {
      pageTitle: errorMessage,
      heading: statusCode,
      message: errorMessage
    })
    .code(statusCode)
}

export { catchAll }
