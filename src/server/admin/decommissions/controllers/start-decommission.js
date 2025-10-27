import { sessionNames } from '../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { decommissionValidation } from '../helpers/schema/decommission-validation.js'
import { fetchEntities } from '../../../common/helpers/fetch/fetch-entities.js'
import { creationStatuses } from '../../../common/constants/creation-statuses.js'

const startDecommissionController = {
  options: {
    id: 'post:admin/decommissions/start'
  },
  handler: async (request, h) => {
    const repositoryName = request.payload.repositoryName

    const entities = await fetchEntities()
    const repositoryNames = entities.map((entity) => entity.name)

    const decommissioningEntities = entities.filter(
      (entity) => entity.status === creationStatuses.decommissioning
    )

    if (decommissioningEntities.length > 0) {
      request.yar.flash(
        sessionNames.globalValidationFailures,
        'There is already an entity being decommissioned'
      )

      request.yar.flash(sessionNames.validationFailure, {
        formValues: { repositoryName }
      })

      return h.redirect(request.routeLookup('admin/decommissions/start'))
    }

    const validationResult = decommissionValidation(repositoryNames).validate(
      { repositoryName },
      { abortEarly: false }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: { repositoryName },
        formErrors: errorDetails
      })

      return h.redirect(request.routeLookup('admin/decommissions/start'))
    }

    if (!validationResult.error) {
      try {
        return h.redirect(`/admin/decommissions/${repositoryName}/confirm`)
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: { repositoryName }
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect(request.routeLookup('admin/decommissions/start'))
      }
    }
  }
}

export { startDecommissionController }
