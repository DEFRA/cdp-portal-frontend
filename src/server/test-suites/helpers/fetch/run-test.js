import { config } from '~/src/config'

async function runTest(request, imageName, environment) {
  const endpoint = config.get('selfServiceOpsApiUrl') + '/deploy-test-suite'

  const { json, response } = await request.authedFetcher(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageName,
      environment
    })
  })

  return { json, response }
}

export { runTest }
