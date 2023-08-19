import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/common/helpers/build-options'
import { availableInstances } from '~/src/server/deploy-service/helpers/available-instances'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/prerequisites/no-session-redirect'
import { provideDeployment } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment'
import { provideOptionsFormValues } from '~/src/server/deploy-service/helpers/prerequisites/provide-options-form-values'

const optionsFormController = {
  options: {
    pre: [noSessionRedirect, provideDeployment, provideOptionsFormValues],
    validate: {
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const query = request?.query
    const formDetail = request?.pre?.formDetail

    return h.view('deploy-service/views/options-form', {
      pageTitle: 'Deploy Service options',
      heading: 'Options',
      headingCaption:
        'Choose Micro-service Instance count, CPU and Memory allocation.',
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation,
      availableInstancesOptions: buildOptions(availableInstances),
      cpuOptions: formDetail.cpuOptions,
      availableMemoryOptions: formDetail.availableMemoryOptions,
      formValues: formDetail.formValues,
      preExistingDetails: formDetail?.preExistingDetails
    })
  }
}

export { optionsFormController }
