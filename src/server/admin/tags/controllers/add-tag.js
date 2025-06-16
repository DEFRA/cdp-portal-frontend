import { addTagToService } from '~/src/server/admin/tags/helpers/fetchers.js'
import { tagValidation } from '~/src/server/admin/tags/helpers/schema/tag-validation.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'

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
