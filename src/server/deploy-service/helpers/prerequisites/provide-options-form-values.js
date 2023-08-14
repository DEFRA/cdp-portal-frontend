import { buildSelectOptions } from '~/src/common/helpers/build-select-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch-deploy-service-options'
import { fetchExistingServiceInfo } from '~/src/server/deploy-service/helpers/fetch-existing-service-info'

const provideOptionsFormValues = {
  method: async (request) => {
    const deploymentSession = request.pre?.deploymentSession

    const { cpuOptions, ecsCpuToMemoryOptionsMap } =
      await fetchDeployServiceOptions()

    const formDetail = {
      formValues: {},
      availableMemoryOptions: optionsWithMessage('Choose a CPU value'),
      cpuOptions: buildSelectOptions(cpuOptions),
      preExistingDetails: false
    }

    if (deploymentSession) {
      const { existingServiceInfo } = await fetchExistingServiceInfo(
        deploymentSession?.environment,
        deploymentSession?.imageName
      )

      // Populate with already deployed service
      if (existingServiceInfo) {
        const cpu = existingServiceInfo?.task_cpu
        formDetail.formValues = {
          // Cast to string due to 0 comparison in govuk select component. 0 is a valid value
          instanceCount: existingServiceInfo?.desired_count?.toString(), // TODO can this be done in a better way?
          memory: existingServiceInfo?.task_memory,
          cpu
        }
        formDetail.availableMemoryOptions = ecsCpuToMemoryOptionsMap[cpu]
        formDetail.preExistingDetails = true
      }

      // If session cpu exists provide memory options dependent on this deploymentSession.cpu value
      if (deploymentSession?.cpu) {
        formDetail.availableMemoryOptions =
          ecsCpuToMemoryOptionsMap[deploymentSession?.cpu]
        formDetail.preExistingDetails = false
      }
    }

    return formDetail
  },
  assign: 'formDetail'
}

export { provideOptionsFormValues }
