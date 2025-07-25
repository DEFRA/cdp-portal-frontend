import { describe, expect, test } from 'vitest'
import { buildHelpText } from './build-help-text.js'
import { deployServiceOptionsFixture } from '../../../__fixtures__/deploy-service/deploy-service-options.js'

describe('#buildHelpText', () => {
  test('Should provide expected help text', () => {
    const cpuValue = deployServiceOptionsFixture.cpuOptions.at(4).value
    const memoryValue =
      deployServiceOptionsFixture.ecsCpuToMemoryOptionsMap[cpuValue].at(1).value

    expect(buildHelpText(cpuValue, memoryValue))
      .toBe(`<p class="govuk-!-margin-bottom-2">
            This deployment requires resources for platform processes:
          </p>
          <ul class="govuk-list govuk-list--bullet govuk-!-margin-0">
            <li>.07 vCPU will be automatically allocated to platform processes. Leaving approximately 7.93 vCPU available.</li>
            <li>100 MB will be automatically allocated to platform processes. Leaving approximately 20380 MB available.</li>
          </ul>`)
  })
})
