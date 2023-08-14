import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

// TODO JsDOc
async function fetchAdminTeams() {
  const teamsEndpointUrl = `${appConfig.get('userServiceApiUrl')}/teams`

  const response = await fetch(teamsEndpointUrl)
  return await response.json()
}

export { fetchAdminTeams }
