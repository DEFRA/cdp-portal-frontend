import { config } from '../../../../config/config.js'
import { sessionNames } from '../../../common/constants/session-names.js'
import { provideCreate } from '../../helpers/pre/provide-create.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { setStepComplete } from '../../helpers/form/index.js'
import { auditMessageCreated } from '../../../common/helpers/audit/messages/audit-message-created.js'
import { scopes, entityTypes } from '@defra/cdp-validation-kit'
import { fetchServiceTemplates } from '../helpers/fetch/fetch-service-templates.js'
import { buildPayload } from '../helpers/build-payload.js'
import { createTenantPayloadValidation } from '../../helpers/schema/create-tenant-payload-validation.js'

const microserviceCreateController = {
  options: {
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, 'team:{payload.teamId}']
      }
    },
    pre: [provideCreate]
  },
  handler: async (request, h) => {
    const userSession = await request.getUserSession()
    const create = request.pre?.create
    const serviceTemplates = await fetchServiceTemplates(request, {
      type: entityTypes.microservice
    })

    const sanitisedPayload = buildPayload({ serviceTemplates, create })

    const validationResult = await createTenantPayloadValidation(
      serviceTemplates
    )
      .validateAsync(sanitisedPayload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: create, error }))

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect('/create/microservice/summary')
    }

    if (!validationResult.error) {
      const selfServiceOpsCreateTenantEndpointUrl =
        config.get('selfServiceOpsUrl') + '/create-tenant'

      try {
        const { payload } = await request.authedFetchJson(
          selfServiceOpsCreateTenantEndpointUrl,
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
          auditMessageCreated('Service', create.microserviceName, userSession)
        )

        return h.redirect(`/services/${payload.repositoryName}`)
      } catch (error) {
        request.logger.error({ error }, 'Create service call failed')
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
