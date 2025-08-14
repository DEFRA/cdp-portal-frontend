import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { optionsWithMessage } from '../../../common/helpers/options/options-with-message.js'
import { fetchDeployServiceOptions } from '../../../common/helpers/fetch/fetch-deploy-service-options.js'
import { fetchLatestDeploymentSettings } from '../../../common/helpers/fetch/fetch-latest-deployment-settings.js'
import { defaultOption } from '../../../common/helpers/options/default-option.js'
import { reduceCpuToMemoryOptions } from '../reduce-cpu-to-memory-options.js'

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
      // Fetch last deployment details
      const lastDeployment = await fetchLatestDeploymentSettings(
        stepData?.environment,
        stepData?.imageName
      )
      const hasLastDeployment =
        lastDeployment && Object.values(lastDeployment).every(Boolean)

      if (stepData.isPrototype) {
        const { reducedCpuOptions, reducedCpuToMemoryOptionsMap } =
          reduceCpuToMemoryOptions({ cpuOptions, ecsCpuToMemoryOptionsMap })
        const availableMemoryOptions = stepData.cpu
          ? [defaultOption, ...reducedCpuToMemoryOptionsMap[stepData.cpu]]
          : optionsWithMessage('Choose a CPU value')

        formDetail.formValues = {
          ...formDetail.formValues,
          instanceCount: 1, // Hardcode the instance count option for prototypes
          cpuOptions: buildOptions(reducedCpuOptions),
          availableMemoryOptions,
          isPrototype: true
        }

        // Populate with last deployment details
        if (hasLastDeployment) {
          const cpu = lastDeployment?.cpu
          const memory = lastDeployment?.memory

          formDetail.formValues = {
            ...formDetail.formValues,
            memory,
            cpu,
            availableMemoryOptions: [
              defaultOption,
              ...reducedCpuToMemoryOptionsMap[cpu]
            ],
            preExistingDetails: true
          }
        }
      }

      if (!stepData.isPrototype) {
        // Populate with last deployment details
        if (hasLastDeployment) {
          const cpu = lastDeployment?.cpu
          const instanceCount = lastDeployment?.instanceCount
          const memory = lastDeployment?.memory

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
    }

    return formDetail
  },
  assign: 'formDetail'
}

export { provideFormValues }
