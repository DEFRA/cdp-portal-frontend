import { config } from '../../../../../../config/config.js'

function deployTerminal({
  request,
  serviceId,
  environment,
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
      teamIds,
      expiresAt
    }
  })
}

export { deployTerminal }
