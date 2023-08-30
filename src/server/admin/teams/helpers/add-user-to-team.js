import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function addUserToTeam(teamId, userId) {
  const addUserToTeamEndpointUrl =
    appConfig.get('userServiceApiUrl') + `/teams/${teamId}/add/${userId}`

  const response = await fetch(addUserToTeamEndpointUrl, {
    method: 'patch',
    headers: { 'Content-Type': 'application/json' }
  })

  const json = await response.json()

  if (response.ok) {
    return json
  }

  throw new Error(json.message)
}

export { addUserToTeam }
