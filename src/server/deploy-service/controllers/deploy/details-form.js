import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { getAdditionalData } from '~/src/server/deploy-service/helpers/get-additional-data.js'
import { detailsValidation } from '~/src/server/deploy-service/helpers/schema/details-validation.js'
import { provideStepData } from '~/src/server/common/helpers/multistep-form/provide-step-data.js'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch/fetch-deployable-image-names.js'

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

    const deployableImageNames = await fetchDeployableImageNames({ request })
    const deployableImageNameOptions = buildOptions(deployableImageNames ?? [])
    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)
    const environmentOptions = environments ? buildOptions(environments) : []

    const {
      runningServicesEntityRows,
      rowHeadings,
      availableVersionOptions,
      latestVersions
    } = await getAdditionalData(imageName, request.auth.credentials?.scope)

    return h.view('deploy-service/views/details-form', {
      pageTitle: 'Deploy Service details',
      heading: 'Details',
      headingCaption:
        'Provide the microservice image name, version and environment to deploy to.',
      formButtonText: redirectLocation ? 'save' : 'next',
      redirectLocation,
      multiStepFormId,
      environmentOptions,
      deployableImageNameOptions,
      availableVersionOptions,
      imageName,
      latestVersions,
      runningServicesEntityRows,
      rowHeadings
    })
  }
}

export { detailsFormController }
