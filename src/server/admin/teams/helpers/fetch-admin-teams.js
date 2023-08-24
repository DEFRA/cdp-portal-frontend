import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

// TODO JsDOc
// TODO change name to fetch CDP teams
async function fetchAdminTeams(name) {
  const teamsEndpointUrl = appConfig.get('userServiceApiUrl') + '/teams'

  const response = await fetch(teamsEndpointUrl)
  return await response.json()
}

export { fetchAdminTeams }
