import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config'
import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import { availableInstances } from '~/src/server/deploy-service/constants/available-instances'
import { noSessionRedirect } from '~/src/server/deploy-service/helpers/ext/no-session-redirect'
import { provideDeployment } from '~/src/server/deploy-service/helpers/pre/provide-deployment'
import { provideOptionsFormValues } from '~/src/server/deploy-service/helpers/pre/provide-options-form-values'
import { cpuToVCpu } from '~/src/server/deploy-service/helpers/cpu-to-vcpu'

const optionsFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideDeployment, provideOptionsFormValues],
    validate: {
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: (request, h) => {
    const query = request?.query
    const formDetail = request?.pre?.formDetail

    return h.view('deploy-service/views/options-form', {
      pageTitle: 'Deploy Service options',
      heading: 'Options',
      headingCaption:
        'Choose Microservice Instance count, CPU and Memory allocation.',
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation,
      availableInstancesOptions: buildOptions(availableInstances),
      cpuOptions: formDetail.cpuOptions,
      availableMemoryOptions: formDetail.availableMemoryOptions,
      formValues: formDetail.formValues,
      preExistingDetails: formDetail?.preExistingDetails,
      platformCPUResourceAsVCpu: cpuToVCpu(config.get('platformCPUResource')),
      platformMemoryResource: config.get('platformMemoryResource')
    })
  }
}

export { optionsFormController }
