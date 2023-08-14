import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

/**
 * @typedef {Object} User
 * @property {string} User.aadId
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
async function fetchUser(userId) {
  const userEndpointUrl = `${appConfig.get(
    'userServiceApiUrl'
  )}/users/${userId}`

  const response = await fetch(userEndpointUrl)

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }
  return await response.json()
}

export { fetchUser }
