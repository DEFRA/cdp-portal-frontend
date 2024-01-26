import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/build-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions'
import { provideDeployment } from '~/src/server/deploy-service/helpers/pre/provide-deployment'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch/fetch-deployable-image-names'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/ext/no-session-redirect'
import { fetchEnvironments } from '~/src/server/deploy-service/helpers/fetch/fetch-environments'

const detailsFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideDeployment],
    validate: {
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const query = request?.query
    const deployment = request.pre?.deployment

    const imageName = deployment?.imageName
    const availableVersionOptions = imageName
      ? buildOptions(await fetchAvailableVersions(imageName))
      : optionsWithMessage('choose an image name')

    const deployableImageNameOptions = buildOptions(
      await fetchDeployableImageNames(request)
    )

    const environmentOptions = buildOptions(await fetchEnvironments(request))

    return h.view('deploy-service/views/details-form', {
      pageTitle: 'Deploy Service details',
      heading: 'Details',
      headingCaption:
        'Provide the microservice image name, version and environment to deploy to.',
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation,
      environmentOptions,
      deployableImageNameOptions,
      availableVersionOptions
    })
  }
}

export { detailsFormController }
