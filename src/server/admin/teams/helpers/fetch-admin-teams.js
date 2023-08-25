import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

// TODO change name to fetch CDP teams
async function fetchAdminTeams() {
  const teamsEndpointUrl = appConfig.get('userServiceApiUrl') + '/teams'

  const response = await fetch(teamsEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw new Error(json.message)
}

export { fetchAdminTeams }
