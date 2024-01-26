import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { testSuiteValidation } from '~/src/server/create/helpers/schema/test-suite-validation'

const envTestSuiteCreateController = {
  options: {
    auth: {
      strategy: 'azure-oidc',
      access: {
        scope: [config.get('oidcAdminGroupId'), '{payload.teamId}']
      }
    },
    pre: [provideCreate]
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

      return h.redirect('/create/env-test-suite/summary')
    }

    if (!validationResult.error) {
      const selfServiceOpsCreateEnvTestSuiteEndpointUrl =
        config.get('selfServiceOpsApiUrl') + '/create-env-test-suite'

      const response = await request.fetchWithAuth(
        selfServiceOpsCreateEnvTestSuiteEndpointUrl,
        {
          method: 'post',
          body: JSON.stringify(sanitisedPayload)
        }
      )
      const json = await response.json()

      if (response.ok) {
        request.yar.clear(sessionNames.validationFailure)
        await request.yar.commit(h)

        request.yar.flash(sessionNames.notifications, {
          text: json.message,
          type: 'success'
        })

        return h.redirect('/create/env-test-suite/success')
      }

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload
      })
      request.yar.flash(sessionNames.globalValidationFailures, json.message)

      return h.redirect('/create/env-test-suite/summary')
    }
  }
}

export { envTestSuiteCreateController }
