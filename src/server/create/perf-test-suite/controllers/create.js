import { config } from '../../../../config/config.js'
import { sessionNames } from '../../../common/constants/session-names.js'
import { provideCreate } from '../../helpers/pre/provide-create.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { testSuiteValidation } from '../../helpers/schema/test-suite-validation.js'
import { setStepComplete } from '../../helpers/form/index.js'
import { auditMessageCreated } from '../../../common/helpers/audit/messages/audit-message-created.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

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
    const userSession = await request.getUserSession()
    const create = request.pre?.create
    const repositoryName = create.repositoryName
    const teamId = request.payload?.teamId
    const templateTag = create.templateTag

    const sanitisedPayload = {
      repositoryName,
      teamId,
      templateTag
    }

    const validationResult = await testSuiteValidation()
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
      const selfServiceOpsCreateEnvTestSuiteEndpointUrl =
        config.get('selfServiceOpsUrl') + '/create-perf-test-suite'

      try {
        const { payload } = await request.authedFetchJson(
          selfServiceOpsCreateEnvTestSuiteEndpointUrl,
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
          auditMessageCreated('Perf Test Suite', repositoryName, userSession)
        )

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
