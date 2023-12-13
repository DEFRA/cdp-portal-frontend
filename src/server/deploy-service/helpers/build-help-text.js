import { config } from '~/src/config'
import { cpuToVCpu } from '~/src/server/deploy-service/helpers/cpu-to-vcpu'

const platformCPUResource = config.get('platformCPUResource')
const platformMemoryResource = config.get('platformMemoryResource')

function buildCpuHelpText(cpu) {
  const availableCpu = cpu - platformCPUResource
  const availableCpuAsVCpu = cpuToVCpu(availableCpu)
  const platformCPUResourceAsVCpu = cpuToVCpu(platformCPUResource)

  return `${platformCPUResourceAsVCpu} vCPU will be automatically allocated to platform processes. Leaving approximately ${availableCpuAsVCpu} vCPU available.`
}

function buildMemoryHelpText(memory) {
  const availableMemory = memory - platformMemoryResource

  return `${platformMemoryResource} MB will be automatically allocated to platform processes. Leaving approximately ${availableMemory} MB available.`
}

function buildHelpText(cpu, memory) {
  return `All deployments require resources for platform processes:
          <ul class="govuk-list govuk-list--bullet govuk-!-margin-top-1 govuk-!-margin-bottom-0">
            <li>${buildCpuHelpText(cpu)}</li>
            <li>${buildMemoryHelpText(memory)}</li>
          </ul>`.trim()
}

export { buildHelpText }
