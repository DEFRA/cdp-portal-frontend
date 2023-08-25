import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function searchCdpUsers(query) {
  const aadUsersEndpointUrl =
    appConfig.get('userServiceApiUrl') +
    '/users' +
    `${query ? `?query=` + query : ''}`

  const response = await fetch(aadUsersEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json.users
  }

  throw new Error(json.message)
}

export { searchCdpUsers }
