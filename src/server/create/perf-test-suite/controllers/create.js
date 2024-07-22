import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { testSuiteValidation } from '~/src/server/create/helpers/schema/test-suite-validation'
import { setStepComplete } from '~/src/server/create/helpers/form'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'
import { auditCreated } from '~/src/server/create/helpers/audit-created'

const perfTestSuiteCreateController = {
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

      return h.redirect('/create/perf-test-suite/summary')
    }

    if (!validationResult.error) {
      const selfServiceOpsCreateEnvTestSuiteEndpointUrl =
        config.get('selfServiceOpsApiUrl') + '/create-perf-test-suite'

      try {
        const { json, response } = await request.authedFetcher(
          selfServiceOpsCreateEnvTestSuiteEndpointUrl,
          {
            method: 'post',
            body: JSON.stringify(sanitisedPayload)
          }
        )

        if (response.ok) {
          await setStepComplete(request, h, 'allSteps')

          request.yar.clear(sessionNames.validationFailure)
          await request.yar.commit(h)

          request.yar.flash(sessionNames.notifications, {
            text: json.message,
            type: 'success'
          })

          auditCreated(request, 'Perf Test Suite', repositoryName)

          return h.redirect(`/test-suites/create-status/${json.repositoryName}`)
        }
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
