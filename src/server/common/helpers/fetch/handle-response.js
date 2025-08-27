import Boom from '@hapi/boom'

import { statusCodes } from '@defra/cdp-validation-kit/src/constants/status-codes.js'

function handleResponse({ res, payload }) {
  if (
    !res.statusCode ||
    res.statusCode < statusCodes.ok ||
    res.statusCode > statusCodes.miscellaneousPersistentWarning
  ) {
    return { res, error: payload || Boom.boomify(new Error('Unknown error')) }
  }

  return { res, payload }
}

export { handleResponse }
