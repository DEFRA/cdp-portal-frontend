import { statusCodes } from '~/src/server/common/constants/status-codes'

function statusCodeMessage(statusCode) {
  switch (true) {
    case statusCode === statusCodes.notFound:
      return 'Page not found'
    case statusCode === statusCodes.forbidden:
      return 'Forbidden'
    case statusCode === statusCodes.unauthorized:
      return 'Unauthorized'
    case statusCode === statusCodes.badRequest:
      return 'Bad Request'
    default:
      return 'Something went wrong'
  }
}

export { statusCodeMessage }
