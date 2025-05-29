import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { serviceValidation } from '~/src/server/admin/decommission-service/helpers/schema/service-validation.js'
import { fetchEntities } from '~/src/server/common/helpers/fetch/fetch-entities.js'

export async function isServiceValid(
  serviceName,
  request,
  includeDecommissioned = false
) {
  const entities = await fetchEntities({ includeDecommissioned })
  const repositoryNames = entities.map((entity) => {
    return entity.name
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
