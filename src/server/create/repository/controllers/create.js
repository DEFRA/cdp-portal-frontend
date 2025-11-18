import { config } from '../../../../config/config.js'
import { sessionNames } from '../../../common/constants/session-names.js'
import { provideCreate } from '../../helpers/pre/provide-create.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { repositoryValidation } from '../helpers/schema/repository-validation.js'
import { scopes } from '@defra/cdp-validation-kit'

const repositoryCreateController = {
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
        const { payload } = await request.authedFetchJson(
          selfServiceOpsCreateRepositoryEndpointUrl,
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
          event: `Repository created: ${repositoryName}`,
          data: { repository: repositoryName }
        })

        return h.redirect(`/repositories/${repositoryName}/status`)
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
