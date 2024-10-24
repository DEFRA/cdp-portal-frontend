import { config } from '~/src/config'
import { provideCdpUser } from '~/src/server/admin/users/helpers/pre/provide-cdp-user'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/ext/no-session-redirect'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/admin/users/helpers/form'

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
      const { response } = await request.authedFetcher(editUserEndpointUrl, {
        method: 'patch',
        body: JSON.stringify({
          name: cdpUser.name,
          email: cdpUser.email,
          github: cdpUser.github,
          defraVpnId: cdpUser.defraVpnId,
          defraAwsId: cdpUser.defraAwsId
        })
      })

      if (response?.ok) {
        await setStepComplete(request, h, 'allSteps')

        request.yar.flash(sessionNames.notifications, {
          text: 'User updated',
          type: 'success'
        })

        return h.redirect('/admin/users/' + cdpUser.userId)
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/admin/users/summary')
    }
  }
}

export { editUserController }
