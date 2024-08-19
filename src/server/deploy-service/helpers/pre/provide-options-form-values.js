import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options/options-with-message'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch/fetch-deploy-service-options'
import { fetchExistingServiceInfo } from '~/src/server/deploy-service/helpers/fetch/fetch-existing-service-info'
import { defaultOption } from '~/src/server/common/helpers/options/default-option'

const provideOptionsFormValues = {
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
      const serviceInfo = await fetchExistingServiceInfo(
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

export { provideOptionsFormValues }
