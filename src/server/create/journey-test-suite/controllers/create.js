import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { testSuiteValidation } from '~/src/server/create/helpers/schema/test-suite-validation'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'
import { auditMessageCreated } from '~/src/server/common/helpers/messages/audit-message-created'

const testSuiteCreateController = {
  options: {
    auth: {
      strategy: 'azure-oidc',
      access: {
        scope: [config.get('oidcAdminGroupId'), '{payload.teamId}']
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
        config.get('selfServiceOpsApiUrl') + '/create-tests'

      try {
        const { json, response } = await request.authedFetcher(
          selfServiceOpsCreateTestSuiteEndpointUrl,
          {
            method: 'post',
            body: JSON.stringify(sanitisedPayload)
          }
        )

        if (response.ok) {
          request.yar.clear(sessionNames.validationFailure)
          await request.yar.commit(h)

          request.yar.flash(sessionNames.notifications, {
            text: json.message,
            type: 'success'
          })

          request.audit.send(
            auditMessageCreated(
              'Journey Test Suite',
              repositoryName,
              request.pre?.authedUser
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
