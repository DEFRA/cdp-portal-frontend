import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchRepository(repositoryId) {
  const repositoryEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesApiUrl'
  )}/repositories/${repositoryId}`

  const response = await fetch(repositoryEndpointUrl)

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }

  return await response.json()
}

export { fetchRepository }
