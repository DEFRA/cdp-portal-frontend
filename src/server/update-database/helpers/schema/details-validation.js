import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchAvailableMigrations } from '~/src/server/services/helpers/fetch/fetch-available-migrations.js'

async function detailsValidation(queryValues, options) {
  const isAuthenticated = options?.context?.auth?.isAuthenticated ?? false

  if (!isAuthenticated) {
    throw Boom.boomify(Boom.unauthorized())
  }

  const migrations = await fetchAvailableMigrations(queryValues?.serviceName)
  const validationResult = Joi.object({
    serviceName: Joi.string().allow(''),
    version: Joi.string().valid(
      ...migrations.map((migration) => migration.version).filter(Boolean)
    ),
    redirectLocation: Joi.string().valid('summary')
  }).validate(queryValues, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export { detailsValidation }
