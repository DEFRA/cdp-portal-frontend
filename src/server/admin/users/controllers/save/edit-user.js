import { config } from '../../../../../config/config.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { provideStepData } from '#server/plugins/multistep-form/provide-step-data.js'
import Joi from 'joi'

const editUserController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideStepData]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.stepData
    const multiStepFormId = request.app.multiStepFormId
    const editUserEndpointUrl = `${config.get('userServiceBackendUrl')}/users/${
      cdpUser.userId
    }`

    try {
      await request.authedFetchJson(editUserEndpointUrl, {
        method: 'patch',
        payload: {
          name: cdpUser.name,
          email: cdpUser.email,
          github: cdpUser.github
        }
      })

      await request.app.saveStepData(multiStepFormId, {}, h)

      request.yar.flash(sessionNames.notifications, {
        text: 'User updated',
        type: 'success'
      })

      return h.redirect('/admin/users/' + cdpUser.userId)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/admin/users/summary')
    }
  }
}

export { editUserController }
