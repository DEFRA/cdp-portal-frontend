import Joi from 'joi'
import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { environments } from '~/src/config'
import { buildOptions } from '~/src/server/common/helpers/build-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch-available-versions'
import { provideDeployment } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch-deployable-image-names'

const detailsFormController = {
  options: {
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
      await fetchDeployableImageNames()
    )

    return h.view('deploy-service/views/details-form', {
      pageTitle: 'Deploy Service details',
      heading: 'Details',
      headingCaption:
        'Provide the Micro-service Image name, version and environment to deploy to.',
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation,
      environmentOptions: buildOptions(
        Object.entries(environments).map(([key, value]) => ({
          value,
          text: startCase(key)
        }))
      ),
      deployableImageNameOptions,
      availableVersionOptions
    })
  }
}

export { detailsFormController }
