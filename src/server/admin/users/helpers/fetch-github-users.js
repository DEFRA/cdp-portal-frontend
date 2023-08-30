import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchGitHubUsers(query) {
  const gitHubUsersEndpointUrl = `${appConfig.get(
    'userServiceApiUrl'
  )}/github-users${query ? '?query=' + query : ''}`

  const response = await fetch(gitHubUsersEndpointUrl, {
    method: 'get',
    headers: { 'Content-Type': 'application/json' }
  })
  const json = await response.json()

  if (response.ok) {
    return json.users
  }

  throw new Error(json.message)
}

export { fetchGitHubUsers }
