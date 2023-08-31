import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function searchCdpUsers(query) {
  const searchUsersEndpointUrl =
    appConfig.get('userServiceApiUrl') +
    '/users' +
    `${query ? `?query=` + query : ''}`

  const response = await fetch(searchUsersEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { searchCdpUsers }
