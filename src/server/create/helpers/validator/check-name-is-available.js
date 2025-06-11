import { fetchRepository } from '~/src/server/common/helpers/fetch/fetch-repository.js'
import { fetchEntity } from '~/src/server/common/helpers/fetch/fetch-entities.js'

async function checkNameIsAvailable(value) {
  const responses = await Promise.allSettled([
    fetchRepository(value),
    fetchEntity(value)
  ])

  const rejected404Statuses = responses
    .filter((response) => response.status === 'rejected')
    .filter((response) => response?.reason?.output?.statusCode === 404)

  return rejected404Statuses.length === 2
}

export { checkNameIsAvailable }
