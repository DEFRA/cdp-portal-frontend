import { buildOptions } from '~/src/server/common/helpers/build-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch-deploy-service-options'
import { fetchExistingServiceInfo } from '~/src/server/deploy-service/helpers/fetch-existing-service-info'
import { defaultOption } from '~/src/server/common/helpers/default-option'

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
      const serviceInfoResponse = await fetchExistingServiceInfo(
        deployment?.environment,
        deployment?.imageName
      )

      // Populate with already deployed service
      if (serviceInfoResponse) {
        const { serviceInfo } = serviceInfoResponse
        const cpu = serviceInfo?.task_cpu
        formDetail.formValues = {
          // Cast to string due to 0 comparison in govuk select component. 0 is a valid value
          instanceCount: serviceInfo?.desired_count?.toString(),
          memory: serviceInfo?.task_memory,
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
