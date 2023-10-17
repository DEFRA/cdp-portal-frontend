import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchTemplates(teamId = null) {
  const templatesEndpointUrl =
    config.get('portalBackendApiUrl') +
    `/templates${teamId ? `?team=${teamId}` : ''}`

  const response = await fetch(templatesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchTemplates }