import { config } from '~/src/config'

async function deployWebShell(request, serviceId, environment) {
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-webshell'

  const { json, response } = await request.authedFetcher(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service: serviceId,
      environment
    })
  })

  return { json, response }
}

export { deployWebShell }
