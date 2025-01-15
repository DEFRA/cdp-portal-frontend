import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'

async function detailsValidation(queryValues, options) {
  const isAuthenticated = options?.context?.auth?.isAuthenticated ?? false

  if (!isAuthenticated) {
    throw Boom.boomify(Boom.unauthorized())
  }

  const availableVersions = await fetchAvailableVersions(queryValues?.imageName)
  const validationResult = Joi.object({
    imageName: Joi.string().allow(''),
    version: Joi.string().valid(
      ...availableVersions.map((version) => version.tag)
    ),
    redirectLocation: Joi.string().valid('summary')
  }).validate(queryValues, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export { detailsValidation }
