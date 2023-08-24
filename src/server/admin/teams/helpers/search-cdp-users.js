import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function searchCdpUsers(query) {
  const aadUsersEndpointUrl =
    appConfig.get('userServiceApiUrl') +
    '/users' +
    `${query ? `?query=` + query : ''}`

  const response = await fetch(aadUsersEndpointUrl)
  const responseJson = await response.json()

  if (response.ok) {
    return responseJson.users
  }

  throw responseJson
}

export { searchCdpUsers }
