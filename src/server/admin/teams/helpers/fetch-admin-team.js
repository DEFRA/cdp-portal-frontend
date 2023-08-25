import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

// TODO change name to fetch CDP team
async function fetchAdminTeam(teamId) {
  const userEndpointUrl = `${appConfig.get(
    'userServiceApiUrl'
  )}/teams/${teamId}`

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

  throw new Error(json.message)
}

export { fetchAdminTeam }
