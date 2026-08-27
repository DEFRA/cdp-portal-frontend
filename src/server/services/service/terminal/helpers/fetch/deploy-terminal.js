import { config } from '#config/config.js'

function deployTerminal({
  request,
  serviceId,
  environment,
  tool,
  teamIds,
  expiresAt
}) {
  const endpoint = config.get('selfServiceOpsUrl') + '/deploy-terminal'

  return request.authedFetchJson(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    payload: {
      service: serviceId,
      environment,
      tool,
      teamIds,
      expiresAt
    }
  })
}

export { deployTerminal }
