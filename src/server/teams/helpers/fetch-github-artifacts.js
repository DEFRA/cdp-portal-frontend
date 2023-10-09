import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { config } from '~/src/config'

async function fetchGithubArtifacts(teamId) {
  const teamGithubArtifactsEndpointUrl =
    config.get('portalBackendApiUrl') + `/github-repo/${teamId}`

  const response = await fetch(teamGithubArtifactsEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Boom.boomify(new Error(json.message), { statusCode: response.status })
}

export { fetchGithubArtifacts }
