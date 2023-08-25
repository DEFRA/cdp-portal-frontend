import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchTemplates(teamId = null) {
  const templatesEndpointUrl =
    appConfig.get('teamsAndRepositoriesApiUrl') +
    `/templates${teamId ? `?team=${teamId}` : ''}`

  const response = await fetch(templatesEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchTemplates }
