import { config } from '../../../../../config/config.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { removeNil } from '../../../../common/helpers/remove-nil.js'
import { provideStepData } from '#server/plugins/multistep-form/provide-step-data.js'
import Joi from 'joi'

const createUserController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideStepData]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.stepData
    const multiStepFormId = request.app.multiStepFormId
    const createUserEndpointUrl = `${config.get('userServiceBackendUrl')}/users`

    try {
      await request.authedFetchJson(createUserEndpointUrl, {
        method: 'post',
        payload: removeNil({
          userId: cdpUser.userId,
          name: cdpUser.name,
          email: cdpUser.email,
          github: cdpUser.github
        })
      })

      await request.app.saveStepData(multiStepFormId, {}, h)

      request.yar.flash(sessionNames.notifications, {
        text: 'User created',
        type: 'success'
      })

      return h.redirect('/admin/users')
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/admin/users/summary')
    }
  }
}

export { createUserController }
