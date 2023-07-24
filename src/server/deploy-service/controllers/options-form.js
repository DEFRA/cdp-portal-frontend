import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildSelectOptions } from '~/src/common/helpers/build-select-options'
import { availableInstances } from '~/src/server/deploy-service/helpers/available-instances'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/prerequisites/no-session-redirect'
import { provideDeploymentSession } from '~/src/server/deploy-service/helpers/prerequisites/provide-deployment-session'
import { provideOptionsFormValues } from '~/src/server/deploy-service/helpers/prerequisites/provide-options-form-values'

const optionsFormController = {
  options: {
    pre: [
      noSessionRedirect,
      provideDeploymentSession,
      provideOptionsFormValues
    ],
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
      availableInstancesOptions: buildSelectOptions(availableInstances),
      cpuOptions: formDetail.cpuOptions,
      availableMemoryOptions: formDetail.availableMemoryOptions,
      formValues: formDetail.formValues,
      preExistingDetails: formDetail?.preExistingDetails
    })
  }
}

export { optionsFormController }
