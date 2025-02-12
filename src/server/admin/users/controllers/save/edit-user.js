import { config } from '~/src/config/config.js'
import { provideCdpUser } from '~/src/server/admin/users/helpers/pre/provide-cdp-user.js'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/ext/no-session-redirect.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { setStepComplete } from '~/src/server/admin/users/helpers/form/index.js'

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
          github: cdpUser.github,
          defraVpnId: cdpUser.defraVpnId,
          defraAwsId: cdpUser.defraAwsId
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
