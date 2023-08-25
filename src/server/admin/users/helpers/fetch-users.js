import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

/**
 * @typedef {Object} User
 * @property {string} User.userId
 * @property {string} User.name
 * @property {string} User.email
 * @property {string} [User.github]
 * @property {string} [User.defraVpnId]
 * @property {string} [User.defraAwsId]
 *
 * @returns {Promise<Array.<User>>}
 */
async function fetchUsers() {
  const usersEndpointUrl = `${appConfig.get('userServiceApiUrl')}/users`

  const response = await fetch(usersEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchUsers }
