import { config } from '../../../../../config/config.js'
import { sessionNames } from '../../../../common/constants/session-names.js'

const editUserController = {
  handler: async (request, h) => {
    const cdpUser = request.pre?.stepData
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
