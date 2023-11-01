import { buildHelpText } from '~/src/server/deploy-service/helpers/build-help-text'
import { deployServiceOptionsFixture } from '~/src/__fixtures__/deploy-service/deploy-service-options'

describe('#buildHelpText', () => {
  test('Should provide expected help text', () => {
    const cpuValue = deployServiceOptionsFixture.cpuOptions.at(4).value
    const memoryValue =
      deployServiceOptionsFixture.ecsCpuToMemoryOptionsMap[cpuValue].value

    expect(buildHelpText(cpuValue, memoryValue))
      .toEqual(`All deployments require resources for platform processes:
          <ul class="govuk-list govuk-list--bullet govuk-!-margin-top-1 govuk-!-margin-bottom-0">
            <li>256 (.25 vCPU) is automatically allocated. You have 7936 (7.75 vCPU) available.</li>
            <li>.25 GB (256 MB) is automatically allocated. You have NaN GB (NaN MB) available.</li>
          </ul>
          Adjust your CPU and Memory as required.`)
  })
})
