import { addTagToService } from '../helpers/fetchers.js'
import { tagValidation } from '../helpers/schema/tag-validation.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { sessionNames } from '../../../common/constants/session-names.js'

const addTagController = {
  handler: async (request, h) => {
    const { serviceId, tag } = request.payload

    const validationResult = tagValidation.validate(
      { serviceId, tag },
      {
        abortEarly: false
      }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: { serviceId, tag },
        formErrors: errorDetails
      })
    }

    if (!validationResult.error) {
      request.logger.info(`Adding ${tag} tag to ${serviceId}`)
      await addTagToService(tag, serviceId)
    }

    return h.redirect(`/admin/tags/${tag}`)
  }
}

export { addTagController }
