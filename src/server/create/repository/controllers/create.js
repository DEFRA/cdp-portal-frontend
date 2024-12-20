import { config } from '~/src/config/config.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { repositoryValidation } from '~/src/server/create/repository/helpers/schema/repository-validation.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { auditMessageCreated } from '~/src/server/common/helpers/audit/messages/audit-message-created.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

const repositoryCreateController = {
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
        config.get('selfServiceOpsUrl') + '/create-repository'

      try {
        const { data, response } = await request.authedFetcher(
          selfServiceOpsCreateRepositoryEndpointUrl,
          {
            method: 'post',
            body: JSON.stringify(sanitisedPayload)
          }
        )

        if (response?.ok) {
          request.yar.clear(sessionNames.validationFailure)
          await request.yar.commit(h)

          request.yar.flash(sessionNames.notifications, {
            text: data.message,
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
