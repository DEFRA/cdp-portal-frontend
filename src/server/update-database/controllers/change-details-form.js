import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { getAdditionalData } from '~/src/server/update-database/helpers/get-additional-data.js'
import { detailsValidation } from '~/src/server/update-database/helpers/schema/details-validation.js'
import { provideStepData } from '~/src/server/common/helpers/multistep-form/provide-step-data.js'
import { fetchPostgresServices } from '~/src/server/update-database/helpers/fetchers.js'
import { fetchLatestMigrations } from '~/src/server/common/helpers/fetch/fetch-latest-migrations.js'

const changeDetailsFormController = {
  options: {
    id: 'update-database/change-details/{multiStepFormId?}',
    pre: [provideStepData],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().optional()
      }),
      query: detailsValidation,
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const query = request?.query
    const stepData = request.pre.stepData
    const serviceName = query?.serviceName ?? stepData?.serviceName
    const redirectLocation = query?.redirectLocation
    const multiStepFormId = request.app.multiStepFormId

    // TODO the image names should only be ones a user owns. Update API to work with teams, same as /deployables
    const postgresServiceNames = await fetchPostgresServices({ request })
    const latestMigrations = await fetchLatestMigrations(serviceName)

    const postgresImageNameOptions = buildOptions(postgresServiceNames ?? [])
    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)
    const environmentOptions = environments ? buildOptions(environments) : []

    const { runningServices, dbChangeOptions, latestDbChanges } =
      await getAdditionalData(serviceName)

    return h.view('update-database/views/change-details-form', {
      pageTitle: 'Update Database change details',
      formButtonText: redirectLocation ? 'save' : 'next',
      redirectLocation,
      multiStepFormId,
      environmentOptions,
      postgresImageNameOptions,
      dbChangeOptions,
      serviceName,
      latestDbChanges,
      runningServices,
      latestMigrations,
      environments
    })
  }
}

export { changeDetailsFormController }
