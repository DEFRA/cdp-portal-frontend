import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { serviceValidation } from '~/src/server/admin/decommission-service/helpers/schema/service-validation.js'
import { fetchEntities } from '~/src/server/common/helpers/fetch/fetch-entities.js'

// FIXME this feels overkill, surely can just check the two names are the same and then check the entity exists
export async function isServiceValid(
  serviceName,
  confirmServiceName,
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
  ).validate({ serviceName, confirmServiceName })

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
