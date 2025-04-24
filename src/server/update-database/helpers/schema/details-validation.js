import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchMigrations } from '~/src/server/services/helpers/fetch/fetch-migrations.js'

async function detailsValidation(queryValues, options) {
  const isAuthenticated = options?.context?.auth?.isAuthenticated ?? false

  if (!isAuthenticated) {
    throw Boom.boomify(Boom.unauthorized())
  }

  const migrations = await fetchMigrations(queryValues?.serviceName)
  const validationResult = Joi.object({
    serviceName: Joi.string().allow(''),
    version: Joi.string().valid(
      ...migrations.map((migration) => migration.version)
    ),
    redirectLocation: Joi.string().valid('summary')
  }).validate(queryValues, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export { detailsValidation }
