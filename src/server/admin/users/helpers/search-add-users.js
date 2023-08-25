import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function searchAadUsers(query) {
  const aadUsersEndpointUrl = `${appConfig.get('userServiceApiUrl')}/aad-users${
    query ? '?query=' + query : ''
  }`

  const response = await fetch(aadUsersEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json.users
  }

  throw Error(json.message)
}

export { searchAadUsers }
