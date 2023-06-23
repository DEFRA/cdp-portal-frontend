import Boom from '@hapi/boom'
import fetch from 'node-fetch'

import { appConfig } from '~/src/config'

async function fetchTemplate(templateId) {
  const templateEndpointUrl = `${appConfig.get(
    'teamsAndRepositoriesApiUrl'
  )}/templates/${templateId}`

  const response = await fetch(templateEndpointUrl)

  if (response.status === 404) {
    throw Boom.boomify(Boom.notFound())
  }

  return await response.json()
}

export { fetchTemplate }
