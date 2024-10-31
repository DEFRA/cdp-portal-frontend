import { statusCodeMessage } from '~/src/server/common/helpers/errors/status-code-message.js'

function catchAll(request, h) {
  const { response } = request

  if (!('isBoom' in response)) {
    return h.continue
  }

  request.logger.error(response, response?.stack, response?.message)

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
