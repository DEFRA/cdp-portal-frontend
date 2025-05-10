import Joi from 'joi'

import { buildHelpText } from '~/src/server/deploy-service/helpers/build-help-text.js'
import { deploymentRows } from '~/src/server/deploy-service/transformers/deployment-rows.js'
import { fetchDeployServiceOptions } from '~/src/server/common/helpers/fetch/fetch-deploy-service-options.js'
import { fetchSecrets } from '~/src/server/common/helpers/fetch/fetch-secrets.js'
import { transformSecrets } from '~/src/server/common/components/secrets-list/helpers/transform-secrets.js'
import { provideStepData } from '~/src/server/common/helpers/multistep-form/provide-step-data.js'
import { checkSessionIsValid } from '~/src/server/common/helpers/multistep-form/check-session-is-valid.js'
import { fetchLatestConfigVersion } from '~/src/server/common/helpers/fetch/fetch-latest-config-version.js'

const summaryController = {
  options: {
    ext: {
      onPreHandler: checkSessionIsValid('/deploy-service')
    },
    pre: [provideStepData],
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().required()
      })
    }
  },
  handler: async (request, h) => {
    const stepData = request.pre?.stepData
    const multiStepFormId = request.params?.multiStepFormId

    const { cpuOptions, ecsCpuToMemoryOptionsMap } =
      await fetchDeployServiceOptions()

    const cpuDetail = cpuOptions.find(
      ({ value }) => value === parseInt(stepData?.cpu, 10)
    )
    const memoryDetail = ecsCpuToMemoryOptionsMap[stepData?.cpu]?.find(
      ({ value }) => value === parseInt(stepData?.memory, 10)
    )

    const secrets = await fetchSecrets(stepData.environment, stepData.imageName)
    const secretDetail = transformSecrets(secrets)

    const configVersion = await fetchLatestConfigVersion(stepData.environment)

    return h.view('deploy-service/views/summary', {
      pageTitle: 'Deploy service summary',
      helpText: buildHelpText(cpuDetail?.value, memoryDetail?.value),
      deploymentRows: deploymentRows(
        stepData,
        cpuDetail,
        memoryDetail,
        multiStepFormId
      ),
      formButtonText: 'Deploy',
      stepData,
      secretDetail,
      multiStepFormId,
      configVersion: configVersion.commitSha
    })
  }
}

export { summaryController }
