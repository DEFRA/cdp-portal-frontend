import Boom from '@hapi/boom'

function throwHttpError(data, response) {
  const message = data?.message ?? response.statusText

  throw Boom.boomify(new Error(message), {
    statusCode: response?.status ?? 500
  })
}

export { throwHttpError }
