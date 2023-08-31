import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchRepositories(teamId = null) {
  const repositoriesEndpointUrl =
    appConfig.get('teamsAndRepositoriesApiUrl') +
    `/repositories${teamId ? `?team=${teamId}` : ''}`

  const response = await fetch(repositoriesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchRepositories }
