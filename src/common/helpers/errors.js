import { createLogger } from '~/src/common/helpers/logger'

const catchAll = function (request, h) {
  const logger = createLogger()
  const { response } = request

  if (!response.isBoom) {
    return h.continue
  }

  const error = response
  const statusCode = error.output.statusCode

  logger.error(response.message, statusCode)

  return h
    .view('error/index', {
      heading: statusCode,
      message: statusCode === 404 ? 'Page not found' : 'Something went wrong'
    })
    .code(statusCode)
}

export { catchAll }
