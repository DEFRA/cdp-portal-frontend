import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchGitHubUsers(query) {
  const gitHubUsersEndpointUrl = `${appConfig.get(
    'userServiceApiUrl'
  )}/github-users${query ? '?query=' + query : ''}`

  const response = await fetch(gitHubUsersEndpointUrl)
  const responseJson = await response.json()

  if (response.ok) {
    return responseJson.users
  }

  throw responseJson
}

export { fetchGitHubUsers }
