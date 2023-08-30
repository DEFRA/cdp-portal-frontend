import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchLibraries(teamId = null) {
  const templatesEndpointUrl =
    appConfig.get('teamsAndRepositoriesApiUrl') +
    `/libraries${teamId ? `?team=${teamId}` : ''}`

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

export { fetchLibraries }
