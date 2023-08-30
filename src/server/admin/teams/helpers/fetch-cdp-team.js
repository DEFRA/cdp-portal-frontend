import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchCdpTeam(teamId) {
  const teamEndpointUrl =
    appConfig.get('userServiceApiUrl') + `/teams/${teamId}`

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

  throw new Error(json.message)
}

export { fetchCdpTeam }
