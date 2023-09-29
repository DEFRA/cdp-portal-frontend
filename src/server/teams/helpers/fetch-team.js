import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchTeam(teamId) {
  const teamEndpointUrl =
    config.get('teamsAndRepositoriesApiUrl') + `/teams/${teamId}`

  const response = await fetch(teamEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchTeam }
