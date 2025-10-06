import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { getEnvironments } from '../../../common/helpers/environments/get-environments.js'
import { getAdditionalData } from '../../helpers/get-additional-data.js'
import { detailsValidation } from '../../helpers/schema/details-validation.js'
import { provideStepData } from '../../../common/helpers/multistep-form/provide-step-data.js'
import { fetchLatestMigrations } from '../../../common/helpers/fetch/fetch-latest-migrations.js'
import { provideDatabaseStatusClassname } from '../../../common/components/database-detail/provide-database-status-classname.js'
import { nullify404 } from '../../../common/helpers/nullify-404.js'
import { buildSuggestions } from '../../../common/components/autocomplete/helpers/build-suggestions.js'
import {
  fetchEntity,
  fetchServiceNames
} from '../../../common/helpers/fetch/fetch-entities.js'

const detailsFormController = {
  options: {
    id: 'deploy-service/details/{multiStepFormId?}',
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
    const userSession = await request.getUserSession()

    const imageName = query?.imageName ?? stepData?.imageName
    const redirectLocation = query?.redirectLocation
    const multiStepFormId = request.app.multiStepFormId

    const serviceNames = await fetchServiceNames(userSession)
    const latestMigrationsResponse = await fetchLatestMigrations(imageName)

    const latestMigrations = latestMigrationsResponse.map((migration) => ({
      ...migration,
      statusClassname: provideDatabaseStatusClassname(migration.status)
    }))

    const entity = await fetchEntity(imageName).catch(nullify404)
    const imageNameOptions = buildOptions(serviceNames)

    const environments = getEnvironments(userSession?.scope, entity?.subType)
    const environmentOptions = environments.length
      ? buildSuggestions(
          environments.map((environment) => ({
            text: environment,
            value: environment
          }))
        )
      : []

    const { runningServices, availableVersionOptions, latestVersions } =
      await getAdditionalData(imageName)

    return h.view('deploy-service/views/details-form', {
      pageTitle: 'Deploy service details',
      formButtonText: redirectLocation ? 'save' : 'next',
      redirectLocation,
      multiStepFormId,
      environmentOptions,
      imageNameOptions,
      availableVersionOptions,
      imageName,
      latestVersions,
      runningServices,
      latestMigrations,
      environments
    })
  }
}

export { detailsFormController }
