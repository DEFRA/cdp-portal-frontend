import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function fetchFinishCreate(repositoryName) {
  const finishCreateEndpointUrl =
    config.get('selfServiceOpsApiUrl') + `/status/finish/${repositoryName}`

  const response = await fetch(finishCreateEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchFinishCreate }
