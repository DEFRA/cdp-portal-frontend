import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function removeUserFromTeam(teamId, userId) {
  const removeUserFromTeamEndpointUrl =
    appConfig.get('userServiceApiUrl') + `/teams/${teamId}/remove/${userId}`

  const response = await fetch(removeUserFromTeamEndpointUrl, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { removeUserFromTeam }
