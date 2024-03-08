import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options/options-with-message'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch/fetch-deploy-service-options'
import { fetchExistingServiceInfo } from '~/src/server/deploy-service/helpers/fetch/fetch-existing-service-info'
import { defaultOption } from '~/src/server/common/helpers/options/default-option'

const provideOptionsFormValues = {
  method: async (request) => {
    const deployment = request.pre?.deployment

    const { cpuOptions, ecsCpuToMemoryOptionsMap } =
      await fetchDeployServiceOptions()

    const formDetail = {
      formValues: {},
      availableMemoryOptions: optionsWithMessage('Choose a CPU value'),
      cpuOptions: buildOptions(cpuOptions),
      preExistingDetails: false
    }

    if (deployment) {
      const serviceInfo = await fetchExistingServiceInfo(
        deployment?.environment,
        deployment?.imageName
      )
      const serviceInfoHasValues =
        serviceInfo && Object.values(serviceInfo).every(Boolean)

      // Populate with already deployed service
      if (serviceInfoHasValues) {
        const cpu = serviceInfo?.cpu
        const instanceCount = serviceInfo?.instanceCount
        const memory = serviceInfo?.memory

        formDetail.formValues = {
          instanceCount,
          memory,
          cpu
        }
        formDetail.availableMemoryOptions = [
          defaultOption,
          ...ecsCpuToMemoryOptionsMap[cpu]
        ]
        formDetail.preExistingDetails = true
      }

      // If session cpu exists provide memory options dependent on this deployment.cpu value
      if (deployment?.cpu) {
        formDetail.availableMemoryOptions = [
          defaultOption,
          ...ecsCpuToMemoryOptionsMap[deployment?.cpu]
        ]
        formDetail.preExistingDetails = false
      }
    }

    return formDetail
  },
  assign: 'formDetail'
}

export { provideOptionsFormValues }
