import { config } from '#config/config.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { removeNil } from '#server/common/helpers/remove-nil.js'

const createUserController = {
  handler: async (request, h) => {
    const cdpUser = request.app.getStepData()
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

      request.yar.flash(sessionNames.notifications, {
        text: 'User created',
        type: 'success'
      })

      return h.redirect('/admin/users')
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/users/summary`)
    }
  }
}

export { createUserController }
