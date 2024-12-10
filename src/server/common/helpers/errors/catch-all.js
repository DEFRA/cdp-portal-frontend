import { statusCodeMessage } from '~/src/server/common/helpers/errors/status-code-message.js'
import { statusCodes } from '~/src/server/common/constants/status-codes.js'

function catchAll(request, h) {
  const { response } = request

  if (!('isBoom' in response)) {
    return h.continue
  }

  const statusCode = response.output.statusCode

  if (statusCode >= statusCodes.internalError) {
    request.logger.error(response, response?.stack, response?.message)
  }

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
