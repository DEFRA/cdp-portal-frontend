import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { decommissionValidation } from '~/src/server/admin/decommissions/helpers/schema/decommission-validation.js'
import { fetchEntities } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { decommission } from '~/src/server/admin/decommissions/helpers/fetchers.js'

const startDecommissionController = {
  options: {
    id: 'post:admin/decommissions/start'
  },
  handler: async (request, h) => {
    const authedUser = await request.getUserSession()
    const repositoryName = request.payload.repositoryName

    const entities = await fetchEntities()
    const repositoryNames = entities.map((entity) => entity.name)

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
        // TODO is anything useful going to be coming back that can be displayed?
        await decommission(repositoryName, authedUser)

        request.yar.flash(sessionNames.notifications, {
          text: 'Decommission requested',
          type: 'success'
        })

        request.audit.sendMessage({
          event: `Decommission: ${repositoryName} requested by ${authedUser.id}:${authedUser.email}`,
          data: {
            repositoryName
          },
          user: authedUser
        })

        return h.redirect(`/admin/decommissions/${repositoryName}`)
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
