import { config } from '~/src/config'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher'
import Boom from '@hapi/boom'

async function fetchRepository(repositoryId) {
  const endpoint =
    config.get('portalBackendApiUrl') + `/repositories/${repositoryId}`

  try {
    const { json } = await fetcher(endpoint)
    return json
  } catch (error) {
    const statusCode = error?.output?.statusCode
    if (statusCode === 404) {
      throw Boom.boomify(Boom.notFound())
    }

    return {}
  }
}

export { fetchRepository }
