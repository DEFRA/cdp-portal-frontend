import { config } from '~/src/config/index.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { testSuiteValidation } from '~/src/server/create/helpers/schema/test-suite-validation.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { auditMessageCreated } from '~/src/server/common/helpers/audit/messages/audit-message-created.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

const testSuiteCreateController = {
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
    const teamId = request.payload?.teamId

    const sanitisedPayload = {
      repositoryName,
      teamId
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

      return h.redirect('/create/journey-test-suite/summary')
    }

    if (!validationResult.error) {
      const selfServiceOpsCreateTestSuiteEndpointUrl =
        config.get('selfServiceOpsUrl') + '/create-tests'

      try {
        const { json, response } = await request.authedFetcher(
          selfServiceOpsCreateTestSuiteEndpointUrl,
          {
            method: 'post',
            body: JSON.stringify(sanitisedPayload)
          }
        )

        if (response?.ok) {
          request.yar.clear(sessionNames.validationFailure)
          await request.yar.commit(h)

          request.yar.flash(sessionNames.notifications, {
            text: json.message,
            type: 'success'
          })

          request.audit.sendMessage(
            auditMessageCreated(
              'Journey Test Suite',
              repositoryName,
              request.pre.authedUser
            )
          )

          return h.redirect('/create/journey-test-suite/success')
        }
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
