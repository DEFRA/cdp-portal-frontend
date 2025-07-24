import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { optionsWithMessage } from '../../../common/helpers/options/options-with-message.js'
import { fetchDeployServiceOptions } from '../../../common/helpers/fetch/fetch-deploy-service-options.js'
import { fetchLatestDeploymentSettings } from '../../../common/helpers/fetch/fetch-latest-deployment-settings.js'
import { defaultOption } from '../../../common/helpers/options/default-option.js'

const provideFormValues = {
  method: async (request) => {
    const stepData = request.pre?.stepData

    const { cpuOptions, ecsCpuToMemoryOptionsMap } =
      await fetchDeployServiceOptions()

    const formDetail = {
      formValues: {
        availableMemoryOptions: optionsWithMessage('Choose a CPU value'),
        cpuOptions: buildOptions(cpuOptions),
        preExistingDetails: false
      }
    }

    if (stepData) {
      const serviceInfo = await fetchLatestDeploymentSettings(
        stepData?.environment,
        stepData?.imageName
      )
      const serviceInfoHasValues =
        serviceInfo && Object.values(serviceInfo).every(Boolean)

      // Populate with already deployed service
      if (serviceInfoHasValues) {
        const cpu = serviceInfo?.cpu
        const instanceCount = serviceInfo?.instanceCount
        const memory = serviceInfo?.memory

        formDetail.formValues = {
          ...formDetail.formValues,
          instanceCount,
          memory,
          cpu,
          availableMemoryOptions: [
            defaultOption,
            ...ecsCpuToMemoryOptionsMap[cpu]
          ],
          preExistingDetails: true
        }
      }

      // If session cpu exists provide memory options dependent on this stepData.cpu value
      if (stepData?.cpu) {
        formDetail.formValues.availableMemoryOptions = [
          defaultOption,
          ...ecsCpuToMemoryOptionsMap[stepData?.cpu]
        ]
        formDetail.formValues.preExistingDetails = false
      }
    }

    return formDetail
  },
  assign: 'formDetail'
}

export { provideFormValues }
