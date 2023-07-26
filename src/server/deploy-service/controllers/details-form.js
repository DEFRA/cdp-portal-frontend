import Joi from 'joi'
import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { environments } from '~/src/config'
import { buildSelectOptions } from '~/src/common/helpers/build-select-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch-available-versions'
import { provideDeploymentSession } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment-session'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch-deployable-image-names'

const detailsFormController = {
  options: {
    pre: [provideDeploymentSession],
    validate: {
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const query = request?.query
    const deploymentSession = request.pre?.deploymentSession

    const imageName = deploymentSession?.imageName
    const availableVersionOptions = imageName
      ? buildSelectOptions(await fetchAvailableVersions(imageName))
      : optionsWithMessage('Choose an image name')

    const deployableImageNameOptions = buildSelectOptions(
      await fetchDeployableImageNames()
    )

    return h.view('deploy-service/views/details-form', {
      pageTitle: 'Deploy Service details',
      heading: 'Details',
      headingCaption:
        'Provide the Micro-service Image name, version and environment to deploy to.',
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation,
      environmentOptions: buildSelectOptions(
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
