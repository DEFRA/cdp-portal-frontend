import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { serviceValidation } from '~/src/server/admin/decommission-service/helpers/schema/service-validation.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'
import { config } from '~/src/config/index.js'

const decommissionServiceController = {
  handler: async (request, h) => {
    const authedUser = await request.getUserSession()
    const payload = request?.payload

    const { repositories } = await fetchRepositories()
    const repositoryNames = repositories.map((repo) => {
      return repo.id
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
        const { data, response } = await request.authedFetcher(
          config.get('selfServiceOpsUrl') + `/decommission/${serviceName}`,
          {
            method: 'delete'
          }
        )

        if (response?.ok) {
          request.yar.clear(sessionNames.validationFailure)
          await request.yar.commit(h)

          request.yar.flash(sessionNames.notifications, {
            text: data.message,
            type: 'success'
          })

          request.audit.sendMessage({
            event: `Service decommissioned: ${serviceName} by ${authedUser.id}:${authedUser.displayName}`,
            data: {
              serviceName
            },
            user: request.pre.authedUser
          })

          return h.redirect(
            `/admin/decommission-service/summary?serviceName=${serviceName}`
          )
        }
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure)
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect('/admin/decommission-service')
      }
    }
  }
}

export { decommissionServiceController }
