import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { appConfig } from '~/src/config'

async function fetchTeams() {
  const teamsEndpointUrl =
    appConfig.get('teamsAndRepositoriesApiUrl') + '/teams'

  const response = await fetch(teamsEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchTeams }
