import { statusCodeMessage } from './status-code-message.js'
import { statusCodes } from '@defra/cdp-validation-kit'

function catchAll(request, h) {
  const { response } = request

  if (!('isBoom' in response)) {
    return h.continue
  }

  const statusCode = response.output.statusCode

  if (statusCode >= statusCodes.internalError) {
    request.logger.error(response, response?.stack, response?.message)
  }

  // Log the error payload if it exists
  if (response.data?.payload) {
    request.logger.error(response.data.payload.toString())
  }

  const errorMessage = statusCodeMessage(statusCode)

  return h
    .view('error/index', {
      pageTitle: errorMessage,
      heading: statusCode,
      message: errorMessage,
      stack: response?.stack
    })
    .code(statusCode)
}

export { catchAll }
