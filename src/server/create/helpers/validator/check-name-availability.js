import { fetchRepository } from '~/src/server/services/helpers/fetch/fetch-repository'
import { fetchCreateStatus } from '~/src/server/services/helpers/fetch/fetch-create-status'

async function checkNameAvailability(value, helpers) {
  const responses = await Promise.allSettled([
    fetchRepository(value),
    fetchCreateStatus(value)
  ])

  const rejected404Statuses = responses
    .filter((response) => response.status === 'rejected')
    .filter((response) => response?.reason?.output?.statusCode === 404)

  if (rejected404Statuses.length === 2) {
    return value
  }

  return helpers.message({
    external: 'Name is already being used'
  })
}

export { checkNameAvailability }
