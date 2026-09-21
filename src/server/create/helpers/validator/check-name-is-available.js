import { fetchEntity } from '../../../common/helpers/fetch/fetch-entities.js'
import { fetchCheckRepositoryName } from '#server/common/helpers/fetch/fetch-check-repository-name.js'

async function checkNameIsAvailable(value) {
  const responses = await Promise.allSettled([
    fetchCheckRepositoryName(value),
    fetchEntity(value)
  ])

  const rejected404Statuses = responses
    .filter((response) => response.status === 'rejected')
    .filter((response) => response?.reason?.output?.statusCode === 404)

  return rejected404Statuses.length === 2
}

export { checkNameIsAvailable }
