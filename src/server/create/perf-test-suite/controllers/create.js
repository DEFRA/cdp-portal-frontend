import { config } from '../../../../config/config.js'
import { sessionNames } from '../../../common/constants/session-names.js'
import { provideCreate } from '../../helpers/pre/provide-create.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { setStepComplete } from '../../helpers/form/index.js'
import { entitySubTypes, entityTypes, scopes } from '@defra/cdp-validation-kit'
import { createTenantPayloadValidation } from '../../helpers/schema/create-tenant-payload-validation.js'
import { fetchServiceTemplates } from '../../microservice/helpers/fetch/fetch-service-templates.js'

const perfTestSuiteCreateController = {
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
    const create = request.pre?.create
    const repositoryName = create.repositoryName
    const teamId = request.payload?.teamId
    const templateTag = create.templateTag

    const sanitisedPayload = {
      repositoryName,
      serviceTypeTemplate: 'cdp-perf-test-suite-template',
      teamId,
      templateTag
    }

    const perfTestTemplates = await fetchServiceTemplates(request, {
      type: entityTypes.testSuite,
      subtype: entitySubTypes.performance
    })

    const validationResult = await createTenantPayloadValidation(
      perfTestTemplates
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
      return h.redirect('/create/perf-test-suite/summary')
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

        request.audit.sendMessage({
          event: `Perf Test Suite created: ${repositoryName}`,
          data: { repository: repositoryName }
        })

        return h.redirect(`/test-suites/${payload.repositoryName}`)
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect('/create/perf-test-suite/summary')
      }
    }
  }
}

export { perfTestSuiteCreateController }
