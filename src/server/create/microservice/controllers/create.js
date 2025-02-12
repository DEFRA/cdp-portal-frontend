import { config } from '~/src/config/config.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { fetchServiceTypes } from '~/src/server/create/microservice/helpers/fetch/fetch-service-types.js'
import { microserviceValidation } from '~/src/server/create/microservice/helpers/schema/microservice-validation.js'
import { setStepComplete } from '~/src/server/create/helpers/form/index.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { auditMessageCreated } from '~/src/server/common/helpers/audit/messages/audit-message-created.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

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
    const templateTag = create.templateTag
    const teamId = request.payload?.teamId

    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypeTemplates = serviceTypes.map(
      (serviceType) => serviceType.value
    )

    const sanitisedPayload = {
      repositoryName,
      serviceTypeTemplate,
      teamId,
      templateTag
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
        config.get('selfServiceOpsUrl') + '/create-microservice'

      try {
        const { payload } = await request.authedFetchJson(
          selfServiceOpsCreateServiceEndpointUrl,
          {
            method: 'post',
            payload: sanitisedPayload
          }
        )

        await setStepComplete(request, h, 'allSteps')

        request.yar.clear(sessionNames.validationFailure)
        await request.yar.commit(h)

        request.yar.flash(sessionNames.notifications, {
          text: payload.message,
          type: 'success'
        })

        request.audit.sendMessage(
          auditMessageCreated('Service', repositoryName, request.pre.authedUser)
        )

        return h.redirect(`/services/create-status/${payload.repositoryName}`)
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
