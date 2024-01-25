import Boom from '@hapi/boom'
import { config } from '~/src/config'

async function fetchDeployableImageNames(request) {
  const authedUser = await request.getUserSession()
  const userGroups = authedUser.scope

  const groupParams = userGroups.map((g) => 'groups=' + g).join('&')
  const deployablesEndpointUrl =
    config.get('portalBackendApiUrl') +
    `/deployables?type=service&${groupParams}`

  const response = await request.fetchWithAuth(deployablesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchDeployableImageNames }
