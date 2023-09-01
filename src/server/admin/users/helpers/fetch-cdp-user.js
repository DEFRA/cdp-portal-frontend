import Boom from '@hapi/boom'
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
 * @throws {Error}
 *
 * @returns {Promise<User>}
 */
async function fetchCdpUser(userId) {
  const userEndpointUrl =
    appConfig.get('userServiceApiUrl') + `/users/${userId}`

  const response = await fetch(userEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchCdpUser }
