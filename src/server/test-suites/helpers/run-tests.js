import fetch from 'node-fetch'
import Boom from '@hapi/boom'

import { config } from '~/src/config'

async function runTests(imageName, environment) {
  const endpoint = config.get('selfServiceOpsApiUrl') + '/deploy-test-suite'

  const payload = {
    imageName,
    environment
  }

  const response = await fetch(endpoint, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { runTests }
