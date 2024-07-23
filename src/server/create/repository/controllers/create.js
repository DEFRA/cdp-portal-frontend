import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { repositoryValidation } from '~/src/server/create/repository/helpers/schema/repository-validation'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user'
import { auditMessageCreated } from '~/src/server/common/helpers/audit/messages/audit-message-created'

const repositoryCreateController = {
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
    const repositoryVisibility = create.repositoryVisibility
    const teamId = request.payload?.teamId

    const sanitisedPayload = {
      repositoryName,
      repositoryVisibility,
      teamId
    }

    const validationResult = await repositoryValidation()
      .validateAsync(sanitisedPayload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: sanitisedPayload, error }))

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect('/create/repository/summary')
    }

    if (!validationResult.error) {
      const selfServiceOpsCreateRepositoryEndpointUrl =
        config.get('selfServiceOpsApiUrl') + '/create-repository'

      try {
        const { json, response } = await request.authedFetcher(
          selfServiceOpsCreateRepositoryEndpointUrl,
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

          request.audit.sendMessage(
            auditMessageCreated(
              'Repository',
              repositoryName,
              request.pre.authedUser
            )
          )

          return h.redirect('/create/repository/success')
        }
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect('/create/repository/summary')
      }
    }
  }
}

export { repositoryCreateController }
