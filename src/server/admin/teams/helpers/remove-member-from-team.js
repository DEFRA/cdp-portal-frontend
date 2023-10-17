import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function removeMemberFromTeam(fetchWithAuth, teamId, userId) {
  const removeUserFromTeamEndpointUrl =
    config.get('userServiceApiUrl') + `/teams/${teamId}/remove/${userId}`

  const response = await fetchWithAuth(removeUserFromTeamEndpointUrl, {
    method: 'patch'
  })

  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { removeMemberFromTeam }
