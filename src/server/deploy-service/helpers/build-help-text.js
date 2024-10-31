import { config } from '~/src/config/index.js'
import { cpuToVCpu } from '~/src/server/deploy-service/helpers/cpu-to-vcpu.js'

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
  return `<p class="govuk-!-margin-bottom-2">
            This deployment requires resources for platform processes:
          </p>
          <ul class="govuk-list govuk-list--bullet govuk-!-margin-0">
            <li>${buildCpuHelpText(cpu)}</li>
            <li>${buildMemoryHelpText(memory)}</li>
          </ul>`.trim()
}

export { buildHelpText }
