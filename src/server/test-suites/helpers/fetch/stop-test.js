import { config } from '~/src/config/config.js'

function stopTest(request, runId) {
  const endpoint = config.get('selfServiceOpsUrl') + '/stop-test-suite'

  return request.authedFetchJson(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    payload: {
      runId
    }
  })
}

export { stopTest }
