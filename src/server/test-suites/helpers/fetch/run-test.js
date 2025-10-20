import { config } from '../../../../config/config.js'
import { runnerConfigurations } from '../../constants/runner-configurations.js'

function runTest({ request, testSuite, environment, configuration, profile }) {
  const { cpu, memory } = runnerConfigurations[configuration]
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-test-suite'

  return request.authedFetchJson(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    payload: {
      testSuite,
      environment,
      cpu: cpu.value,
      memory: memory.value,
      profile
    }
  })
}

export { runTest }
