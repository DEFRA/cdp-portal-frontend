import Boom from '@hapi/boom'

function handleResponse({ res, payload }) {
  if (!res.statusCode || res.statusCode < 200 || res.statusCode > 299) {
    return { res, error: payload || Boom.boomify(new Error('Unknown error')) }
  }

  return { res, payload }
}

export { handleResponse }
