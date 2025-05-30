import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { scaleEcsToZero } from '~/src/server/admin/decommission-service/helpers/fetch/scale-ecs-to-zero.js'
import { isServiceValid } from '~/src/server/admin/decommission-service/helpers/is-service-valid.js'

const decommissionServiceController = {
  handler: async (request, h) => {
    const authedUser = await request.getUserSession()
    const payload = request?.payload
    const serviceName = payload.serviceName

    const serviceIsValid = await isServiceValid(serviceName, request)

    if (!serviceIsValid) {
      return h.redirect('/admin/decommission-service')
    }

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
}

export { decommissionServiceController }
