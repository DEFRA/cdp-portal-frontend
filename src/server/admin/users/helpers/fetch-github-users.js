import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

// TODO JSDoc
async function fetchGitHubUsers(username) {
  const gitHubUsersEndpointUrl = `${appConfig.get('mockApiUrl')}/github-users${
    username ? '?username=' + username : ''
  }`

  const response = await fetch(gitHubUsersEndpointUrl)
  return await response.json()
}

export { fetchGitHubUsers }
