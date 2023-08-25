import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchTeam(teamId) {
  const teamEndpointUrl =
    appConfig.get('teamsAndRepositoriesApiUrl') + `/teams/${teamId}`

  const response = await fetch(teamEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchTeam }
