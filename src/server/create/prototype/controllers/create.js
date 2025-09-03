import { config } from '../../../../config/config.js'
import { sessionNames } from '../../../common/constants/session-names.js'
import { provideCreate } from '../../helpers/pre/provide-create.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { auditMessageCreated } from '../../../common/helpers/audit/messages/audit-message-created.js'
import { scopes } from '@defra/cdp-validation-kit'
import { prototypeValidation } from '../schema/prototype-validation.js'

const prototypeCreateController = {
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
    const templateTag = create.templateTag
    const teamId = request.payload?.teamId

    const sanitisedPayload = {
      repositoryName,
      teamId,
      templateTag
    }

    const validationResult = await prototypeValidation()
      .validateAsync(sanitisedPayload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: sanitisedPayload, error }))

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect('/create/prototype/summary')
    }

    if (!validationResult.error) {
      const createEndpointUrl =
        config.get('selfServiceOpsUrl') + '/create-prototype'

      try {
        const { payload } = await request.authedFetchJson(createEndpointUrl, {
          method: 'post',
          payload: sanitisedPayload
        })

        request.yar.clear(sessionNames.validationFailure)
        await request.yar.commit(h)

        request.yar.flash(sessionNames.notifications, {
          text: payload.message,
          type: 'success'
        })

        request.audit.sendMessage(
          auditMessageCreated('Repository', repositoryName, userSession)
        )

        return h.redirect(`/services/${payload.repositoryName}`)
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect('/create/prototype/summary')
      }
    }
  }
}

export { prototypeCreateController }
