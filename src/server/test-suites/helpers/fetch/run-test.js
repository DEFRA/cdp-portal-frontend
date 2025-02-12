import { config } from '~/src/config/config.js'

function runTest(request, imageName, environment) {
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-test-suite'

  return request.authedFetchJson(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    payload: {
      imageName,
      environment
    }
  })
}

export { runTest }
