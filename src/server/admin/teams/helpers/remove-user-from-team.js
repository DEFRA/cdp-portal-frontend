import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'
import { fetchWithAuth } from '~/src/server/common/helpers/fetch-with-auth'

async function removeUserFromTeam(auth, teamId, userId) {
  const removeUserFromTeamEndpointUrl =
    appConfig.get('userServiceApiUrl') + `/teams/${teamId}/remove/${userId}`

  const response = await fetchWithAuth(auth, removeUserFromTeamEndpointUrl, {
    method: 'patch'
  })

  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { removeUserFromTeam }
