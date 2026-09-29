import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { optionsWithMessage } from '../../../common/helpers/options/options-with-message.js'
import { fetchDeployServiceOptions } from '../../../common/helpers/fetch/fetch-deploy-service-options.js'
import { fetchLatestDeploymentSettings } from '../../../common/helpers/fetch/fetch-latest-deployment-settings.js'
import { defaultOption } from '../../../common/helpers/options/default-option.js'

export const provideFormValues = {
  method: async (request) => {
    const stepData = request.pre?.stepData
    const isPrototype = stepData?.isPrototype === true

    const { cpuOptions, ecsCpuToMemoryOptionsMap } =
      await fetchDeployServiceOptions(isPrototype)

    const formDetail = {
      formValues: {
        availableMemoryOptions: optionsWithMessage('Choose a CPU value'),
        cpuOptions: buildOptions(cpuOptions),
        preExistingDetails: false
      }
    }

    if (isPrototype) {
      formDetail.formValues.instanceCount = 1 // Hardcode the instance count option for prototypes
      formDetail.formValues.isPrototype = true
    }

    if (stepData) {
      // Fetch last deployment details
      const lastDeployment = await fetchLatestDeploymentSettings(
        stepData.environment,
        stepData.imageName
      )
      const hasLastDeployment =
        lastDeployment && Object.values(lastDeployment).every(Boolean)

      // Populate with last deployment details
      if (hasLastDeployment) {
        const cpu = lastDeployment.cpu

        formDetail.formValues = {
          ...formDetail.formValues,
          instanceCount: isPrototype ? 1 : lastDeployment.instanceCount,
          memory: lastDeployment.memory,
          cpu,
          availableMemoryOptions: [
            defaultOption,
            ...ecsCpuToMemoryOptionsMap[cpu]
          ],
          preExistingDetails: true
        }
      }

      if (stepData.cpu) {
        formDetail.formValues.availableMemoryOptions = [
          defaultOption,
          ...ecsCpuToMemoryOptionsMap[stepData.cpu]
        ]
        formDetail.formValues.preExistingDetails = false
      }
    }

    return formDetail
  },
  assign: 'formDetail'
}
