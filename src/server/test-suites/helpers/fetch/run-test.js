import { config } from '../../../../config/config.js'
import { runnerProfiles } from '../../constants/runner-profiles.js'

function runTest({ request, imageName, environment, profile }) {
  const { cpu, memory } = runnerProfiles[profile]
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-test-suite'

  return request.authedFetchJson(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    payload: {
      imageName,
      environment,
      cpu: cpu.value,
      memory: memory.value
    }
  })
}

export { runTest }
