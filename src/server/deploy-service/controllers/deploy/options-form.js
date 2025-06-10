import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config/config.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { availableInstances } from '~/src/server/deploy-service/constants/available-instances.js'
import { provideFormValues } from '~/src/server/deploy-service/helpers/pre/provide-form-values.js'
import { cpuToVCpu } from '~/src/server/deploy-service/helpers/cpu-to-vcpu.js'
import { provideStepData } from '~/src/server/common/helpers/multistep-form/provide-step-data.js'
import { checkSessionIsValid } from '~/src/server/common/helpers/multistep-form/check-session-is-valid.js'
import { transformRunningServices } from '~/src/server/services/service/about/transformers/running-services.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { provideDatabaseStatusClassname } from '~/src/server/common/components/database-detail/provide-database-status-classname.js'
import { fetchLatestMigrations } from '~/src/server/common/helpers/fetch/fetch-latest-migrations.js'

const optionsFormController = {
  options: {
    ext: {
      onPreHandler: checkSessionIsValid('/deploy-service')
    },
    pre: [provideStepData, provideFormValues],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid()
      }),
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const authedUser = await request.getUserSession()
    const query = request?.query
    const formDetail = request?.pre?.formDetail
    const multiStepFormId = request.app.multiStepFormId
    const stepData = request.pre.stepData

    const imageName = stepData?.imageName
    const { runningServices } = await transformRunningServices(imageName)
    const latestMigrationsResponse = await fetchLatestMigrations(imageName)
    const latestMigrations = latestMigrationsResponse.map((migration) => ({
      ...migration,
      statusClassname: provideDatabaseStatusClassname(migration.status)
    }))
    const environments = getEnvironments(authedUser?.scope)

    return h.view('deploy-service/views/options-form', {
      pageTitle: 'Deploy service options',
      multiStepFormId,
      runningServices,
      environments,
      imageName,
      latestMigrations,
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation,
      availableInstancesOptions: buildOptions(availableInstances),
      formValues: formDetail.formValues,
      platformCPUResourceAsVCpu: cpuToVCpu(config.get('platformCPUResource')),
      platformMemoryResource: config.get('platformMemoryResource')
    })
  }
}

export { optionsFormController }
