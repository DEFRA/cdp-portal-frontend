import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

// TODO JSDoc
// TODO change name to fetch CDP team
async function fetchAdminTeam(teamId) {
  const userEndpointUrl = `${appConfig.get(
    'userServiceApiUrl'
  )}/teams/${teamId}`

  const response = await fetch(userEndpointUrl)

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }
  return await response.json()
}

export { fetchAdminTeam }
