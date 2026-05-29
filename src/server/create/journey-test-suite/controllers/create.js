import { config } from '#config/config.js'
import { sessionNames } from '../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { entityTypes, entitySubTypes } from '@defra/cdp-validation-kit'
import { fetchServiceTemplates } from '../../microservice/helpers/fetch/fetch-service-templates.js'
import { createTenantPayloadValidation } from '../../helpers/schema/create-tenant-payload-validation.js'

const testSuiteCreateController = {
  handler: async (request, h) => {
    const create = request.app.getStepData()
    const repositoryName = create.repositoryName
    const templateTag = create.templateTag
    const teamId = request.payload?.teamId

    const sanitisedPayload = {
      repositoryName,
      serviceTypeTemplate: 'cdp-node-journey-test-suite-template',
      teamId,
      templateTag
    }

    const journeyTestTemplates = await fetchServiceTemplates(request, {
      type: entityTypes.testSuite,
      subtype: entitySubTypes.journey
    })

    const validationResult = await createTenantPayloadValidation(
      journeyTestTemplates
    )
      .validateAsync(sanitisedPayload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: sanitisedPayload, error }))

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect('/create/journey-test-suite/summary')
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

        request.yar.clear(sessionNames.validationFailure)
        await request.yar.commit(h)

        request.yar.flash(sessionNames.notifications, {
          text: payload.message,
          type: 'success'
        })

        request.audit.sendMessage({
          event: `Journey Test Suite created: ${repositoryName}`,
          data: { repositoryName }
        })

        return h.redirect(`/test-suites/${payload.repositoryName}`)
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect('/create/journey-test-suite/summary')
      }
    }
  }
}

export { testSuiteCreateController }
