import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'

async function addUserToTeam(fetchWithAuth, teamId, userId) {
  const addUserToTeamEndpointUrl =
    appConfig.get('userServiceApiUrl') + `/teams/${teamId}/add/${userId}`

  const response = await fetchWithAuth(addUserToTeamEndpointUrl, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { addUserToTeam }
