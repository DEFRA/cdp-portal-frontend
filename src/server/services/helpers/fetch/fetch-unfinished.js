import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchUnfinished() {
  const unfinishedEndpointUrl =
    config.get('selfServiceOpsApiUrl') + '/status/unfinished'

  const response = await fetch(unfinishedEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchUnfinished }
