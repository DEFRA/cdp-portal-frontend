import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '../../common/helpers/options/build-options.js'
import { getEnvironments } from '../../common/helpers/environments/get-environments.js'
import { getAdditionalData } from '../helpers/get-additional-data.js'
import { detailsValidation } from '../helpers/schema/details-validation.js'
import { provideStepData } from '../../common/helpers/multistep-form/provide-step-data.js'
import { fetchPostgresServices } from '../helpers/fetchers.js'
import { fetchLatestMigrations } from '../../common/helpers/fetch/fetch-latest-migrations.js'
import { provideDatabaseStatusClassname } from '../../common/components/database-detail/provide-database-status-classname.js'

const changeDetailsFormController = {
  options: {
    id: 'apply-changelog/change-details/{multiStepFormId?}',
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

    const postgresServiceNames = await fetchPostgresServices({ request })
    const latestMigrations = await fetchLatestMigrations(serviceName)

    const postgresImageNameOptions = buildOptions(postgresServiceNames ?? [])
    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)
    const environmentOptions = environments ? buildOptions(environments) : []

    const { runningServices, dbChangeOptions, latestDbChanges } =
      await getAdditionalData(serviceName)

    return h.view('apply-changelog/views/change-details-form', {
      pageTitle: 'Apply changelog details',
      formButtonText: redirectLocation ? 'save' : 'next',
      redirectLocation,
      multiStepFormId,
      environmentOptions,
      postgresImageNameOptions,
      dbChangeOptions,
      serviceName,
      latestDbChanges,
      runningServices,
      latestMigrations: latestMigrations.map((migration) => ({
        ...migration,
        statusClassname: provideDatabaseStatusClassname(migration.status)
      })),
      environments
    })
  }
}

export { changeDetailsFormController }
