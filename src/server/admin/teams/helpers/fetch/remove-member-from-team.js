import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function removeMemberFromTeam(request, teamId, userId) {
  const endpoint =
    config.get('userServiceApiUrl') + `/teams/${teamId}/remove/${userId}`

  const response = await request.authedFetcher(endpoint, {
    method: 'patch'
  })

  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { removeMemberFromTeam }
