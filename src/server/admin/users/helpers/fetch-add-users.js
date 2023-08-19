import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

// TODO JSDoc
async function fetchAadUsers(email) {
  const aadUsersEndpointUrl = `${appConfig.get('mockApiUrl')}/users${
    email ? '?email=' + email : ''
  }`

  const response = await fetch(aadUsersEndpointUrl)
  return await response.json()
}

export { fetchAadUsers }
