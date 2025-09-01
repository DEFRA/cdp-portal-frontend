import { config } from '../../../../../config/config.js'
import { provideCdpUser } from '../../helpers/pre/provide-cdp-user.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { setStepComplete } from '../../helpers/form/index.js'
import { removeNil } from '../../../../common/helpers/remove-nil.js'

const createUserController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser
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

      await setStepComplete(request, h, 'allSteps')

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
