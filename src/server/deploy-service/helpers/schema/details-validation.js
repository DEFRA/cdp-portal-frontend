import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch/fetch-deployable-image-names.js'

async function detailsValidation(queryValues, options) {
  const isAuthenticated = options?.context?.auth?.isAuthenticated ?? false

  if (!isAuthenticated) {
    throw Boom.boomify(Boom.unauthorized())
  }

  const deployableImageNames = await fetchDeployableImageNames({
    scope: options?.context?.auth?.credentials?.scope
  })
  const availableVersions = await fetchAvailableVersions(queryValues?.imageName)

  const validationResult = Joi.object({
    imageName: Joi.string().valid(...deployableImageNames),
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
