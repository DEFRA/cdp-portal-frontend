import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { serviceValidation } from '~/src/server/admin/decommission-service/helpers/schema/service-validation.js'

export async function isServiceValid(serviceName, request) {
  const { repositories } = await fetchRepositories()
  const repositoryNames = repositories.map((repo) => {
    return repo.id
  })

  const validationResult = serviceValidation(
    repositoryNames,
    serviceName
  ).validate({ serviceName, confirmServiceName: serviceName })

  if (validationResult?.error) {
    const errorDetails = buildErrorDetails(validationResult.error.details)

    request.yar.flash(sessionNames.validationFailure, {
      formValues: { serviceName },
      formErrors: errorDetails
    })

    return false
  }
  return true
}
