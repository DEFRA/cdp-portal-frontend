import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { fetchServiceTypes } from '~/src/server/create/microservice/helpers/fetch/fetch-service-types'
import { microserviceValidation } from '~/src/server/create/microservice/helpers/schema/microservice-validation'
import { setStepComplete } from '~/src/server/create/helpers/form'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'
import { auditMessageCreated } from '~/src/server/common/helpers/audit/messages/audit-message-created'
import { scopes } from '~/src/server/common/constants/scopes'

const microserviceCreateController = {
  options: {
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, '{payload.teamId}']
      }
    },
    pre: [provideCreate, provideAuthedUser]
  },
  handler: async (request, h) => {
    const create = request.pre?.create
    const repositoryName = create.repositoryName
    const serviceTypeTemplate = create.serviceTypeTemplate
    const teamId = request.payload?.teamId

    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypeTemplates = serviceTypes.map(
      (serviceType) => serviceType.value
    )

    const sanitisedPayload = {
      repositoryName,
      serviceTypeTemplate,
      teamId
    }

    const validationResult = await microserviceValidation(serviceTypeTemplates)
      .validateAsync(sanitisedPayload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: sanitisedPayload, error }))

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect('/create/microservice/summary')
    }

    if (!validationResult.error) {
      const selfServiceOpsCreateServiceEndpointUrl =
        config.get('selfServiceOpsApiUrl') + '/create-microservice'

      try {
        const { json, response } = await request.authedFetcher(
          selfServiceOpsCreateServiceEndpointUrl,
          {
            method: 'post',
            body: JSON.stringify(sanitisedPayload)
          }
        )

        if (response?.ok) {
          await setStepComplete(request, h, 'allSteps')

          request.yar.clear(sessionNames.validationFailure)
          await request.yar.commit(h)

          request.yar.flash(sessionNames.notifications, {
            text: json.message,
            type: 'success'
          })

          request.audit.sendMessage(
            auditMessageCreated(
              'Service',
              repositoryName,
              request.pre.authedUser
            )
          )

          return h.redirect(`/services/create-status/${json.repositoryName}`)
        }
      } catch (error) {
        request.logger.debug({ error }, 'Create service call failed')
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect('/create/microservice/summary')
      }
    }
  }
}

export { microserviceCreateController }
