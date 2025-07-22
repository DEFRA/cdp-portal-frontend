import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { getAdditionalData } from '~/src/server/deploy-service/helpers/get-additional-data.js'
import { detailsValidation } from '~/src/server/deploy-service/helpers/schema/details-validation.js'
import { provideStepData } from '~/src/server/common/helpers/multistep-form/provide-step-data.js'
import { fetchLatestMigrations } from '~/src/server/common/helpers/fetch/fetch-latest-migrations.js'
import { provideDatabaseStatusClassname } from '~/src/server/common/components/database-detail/provide-database-status-classname.js'
import { nullify404 } from '~/src/server/common/helpers/nullify-404.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import {
  fetchEntity,
  fetchServices
} from '~/src/server/common/helpers/fetch/fetch-entities.js'

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
    const imageName = query?.imageName ?? stepData?.imageName
    const redirectLocation = query?.redirectLocation
    const multiStepFormId = request.app.multiStepFormId
    const authedUser = await request.getUserSession()
    const userScopes = authedUser?.scope

    const teamIds = authedUser?.isAdmin ? [] : userScopes

    const services = await fetchServices({ teamIds })
    const latestMigrationsResponse = await fetchLatestMigrations(imageName)

    const latestMigrations = latestMigrationsResponse.map((migration) => ({
      ...migration,
      statusClassname: provideDatabaseStatusClassname(migration.status)
    }))

    const entity = await fetchEntity(imageName).catch(nullify404)

    const imageNameOptions = buildOptions(
      services.map((service) => service.name)
    )

    const environments = getEnvironments(userScopes, entity?.type)
    const environmentOptions = environments.length
      ? buildSuggestions(environments)
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
