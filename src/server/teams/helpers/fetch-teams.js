import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchTeams() {
  const teamsEndpointUrl =
    appConfig.get('teamsAndRepositoriesApiUrl') + '/teams'

  const response = await fetch(teamsEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw Error(json.message)
}

export { fetchTeams }
