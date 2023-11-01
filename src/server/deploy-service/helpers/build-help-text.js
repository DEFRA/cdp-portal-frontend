import { config } from '~/src/config'

const platformCPUResource = config.get('platformCPUResource')
const platformMemoryResource = config.get('platformMemoryResource')

function buildCpuHelpText(value) {
  const availableCpu = value - platformCPUResource
  const availableCpuAsvCPU = (availableCpu / 1024).toString().replace(/^0/g, '')

  return `256 (.25 vCPU) is automatically allocated. You have ${availableCpu} (${availableCpuAsvCPU} vCPU) available.`
}

function buildMemoryHelpText(value) {
  const availableMemory = value - platformMemoryResource
  const availableMemoryAsGb = availableMemory / 1024

  return `.25 GB (256 MB) is automatically allocated. You have ${availableMemoryAsGb} GB (${availableMemory} MB) available.`
}

function buildHelpText(cpu, memory) {
  return `All deployments require resources for platform processes:
          <ul class="govuk-list govuk-list--bullet govuk-!-margin-top-1 govuk-!-margin-bottom-0">
            <li>${buildCpuHelpText(cpu)}</li>
            <li>${buildMemoryHelpText(memory)}</li>
          </ul>
          Adjust your CPU and Memory as required.`.trim()
}

export { buildHelpText }
