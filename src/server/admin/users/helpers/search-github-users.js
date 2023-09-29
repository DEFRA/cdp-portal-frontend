import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function searchGitHubUsers(query) {
  const searchGitHubUsersEndpointUrl =
    config.get('userServiceApiUrl') +
    `/github-users${query ? '?query=' + query : ''}`

  const response = await fetch(searchGitHubUsersEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { searchGitHubUsers }
