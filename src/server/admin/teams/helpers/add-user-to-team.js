import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'
import { fetchWithAuth } from '~/src/server/common/helpers/fetch-with-auth'

async function addUserToTeam(auth, teamId, userId) {
  const addUserToTeamEndpointUrl =
    appConfig.get('userServiceApiUrl') + `/teams/${teamId}/add/${userId}`

  const response = await fetchWithAuth(auth, addUserToTeamEndpointUrl, {
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
