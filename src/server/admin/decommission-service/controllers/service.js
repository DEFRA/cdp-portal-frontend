import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { serviceValidation } from '~/src/server/admin/decommission-service/helpers/schema/service-validation.js'
import { scaleEcsToZero } from '~/src/server/admin/decommission-service/helpers/fetch/scale-ecs-to-zero.js'
import { fetchEntities } from '~/src/server/common/helpers/fetch/fetch-entities.js'

const decommissionServiceController = {
  handler: async (request, h) => {
    const authedUser = await request.getUserSession()
    const payload = request?.payload

    const entities = await fetchEntities()
    const repositoryNames = entities.map((entity) => {
      return entity.name
    })

    const validationResult = serviceValidation(
      repositoryNames,
      payload.serviceName
    ).validate(payload)

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload,
        formErrors: errorDetails
      })

      return h.redirect('/admin/decommission-service')
    }

    if (!validationResult.error) {
      const serviceName = payload.serviceName
      try {
        await scaleEcsToZero(request, serviceName)

        request.yar.clear(sessionNames.validationFailure)
        await request.yar.commit(h)

        request.yar.flash(sessionNames.notifications, {
          text: 'Service decommissioned successfully so far',
          type: 'success'
        })

        request.audit.sendMessage({
          event: `Service decommissioning started: ${serviceName} by ${authedUser.id}:${authedUser.displayName}`,
          data: {
            serviceName
          },
          user: request.pre.authedUser
        })

        return h.redirect(`/admin/decommission-service/${serviceName}/step-1`)
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure)
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect('/admin/decommission-service')
      }
    }
    return h.redirect('/admin/decommission-service')
  }
}

export { decommissionServiceController }
