import { config } from '../../../../../config/config.js'
import { provideCdpUser } from '../../helpers/pre/provide-cdp-user.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { setStepComplete } from '../../helpers/form/index.js'

const editUserController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser
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

      await setStepComplete(request, h, 'allSteps')

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
