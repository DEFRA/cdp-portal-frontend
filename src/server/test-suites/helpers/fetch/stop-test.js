import { config } from '~/src/config/config.js'

async function stopTest(request, runId) {
  const endpoint = config.get('selfServiceOpsUrl') + '/stop-test-suite'

  await request.authedFetcher(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      runId
    })
  })
}

export { stopTest }
