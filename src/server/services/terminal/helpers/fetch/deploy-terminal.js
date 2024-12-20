import { config } from '~/src/config/config.js'

async function deployTerminal(request, serviceId, environment) {
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-terminal'

  const { data, response } = await request.authedFetcher(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service: serviceId,
      environment
    })
  })

  return { data, response }
}

export { deployTerminal }
