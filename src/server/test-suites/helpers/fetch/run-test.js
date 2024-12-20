import { config } from '~/src/config/config.js'

async function runTest(request, imageName, environment) {
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-test-suite'

  const { response } = await request.authedFetcher(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageName,
      environment
    })
  })

  return { response }
}

export { runTest }
