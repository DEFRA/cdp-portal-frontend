import { config } from '~/src/config'

async function stopTest(request, runId) {
  const endpoint = config.get('selfServiceOpsUrl') + '/stop-test-suite'

  const { json, response } = await request.authedFetcher(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      runId
    })
  })

  return { json, response }
}

export { stopTest }
