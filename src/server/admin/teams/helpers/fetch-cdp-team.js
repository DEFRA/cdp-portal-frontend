import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchCdpTeam(teamId) {
  const teamEndpointUrl = config.get('userServiceApiUrl') + `/teams/${teamId}`

  const response = await fetch(teamEndpointUrl, {
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

export { fetchCdpTeam }
