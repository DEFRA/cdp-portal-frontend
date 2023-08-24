import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function searchAadUsers(query) {
  const aadUsersEndpointUrl = `${appConfig.get('userServiceApiUrl')}/aad-users${
    query ? '?query=' + query : ''
  }`

  const response = await fetch(aadUsersEndpointUrl)

  if (response.ok) {
    const { users } = await response.json()

    return users
  }
}

export { searchAadUsers }
