import { buildHelpText } from '~/src/server/deploy-service/helpers/build-help-text'
import { deployServiceOptionsFixture } from '~/src/__fixtures__/deploy-service/deploy-service-options'

describe('#buildHelpText', () => {
  test('Should provide expected help text', () => {
    const cpuValue = deployServiceOptionsFixture.cpuOptions.at(4).value
    const memoryValue =
      deployServiceOptionsFixture.ecsCpuToMemoryOptionsMap[cpuValue].at(1).value

    expect(buildHelpText(cpuValue, memoryValue))
      .toEqual(`All deployments require resources for platform processes:
          <ul class="govuk-list govuk-list--bullet govuk-!-margin-top-1 govuk-!-margin-bottom-0">
            <li>.07 vCPU will be automatically allocated to platform processes. Leaving approximately 7.93 vCPU available.</li>
            <li>100 MB will be automatically allocated to platform processes. Leaving approximately 20380 MB available.</li>
          </ul>`)
  })
})
