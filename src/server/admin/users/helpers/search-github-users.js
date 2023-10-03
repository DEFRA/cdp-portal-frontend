import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function searchGithubUsers(query) {
  const searchGithubUsersEndpointUrl =
    config.get('userServiceApiUrl') +
    `/github-users${query ? '?query=' + query : ''}`

  const response = await fetch(searchGithubUsersEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { searchGithubUsers }
