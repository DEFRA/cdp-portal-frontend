import { config } from '~/src/config'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/ext/no-session-redirect'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/admin/users/helpers/form'
import { removeNil } from '~/src/server/common/helpers/remove-nil'

const createUserController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser
    const createUserEndpointUrl = `${config.get('userServiceApiUrl')}/users`

    const response = await request.fetchWithAuth(createUserEndpointUrl, {
      method: 'post',
      body: JSON.stringify(
        removeNil({
          userId: cdpUser.userId,
          name: cdpUser.name,
          email: cdpUser.email,
          github: cdpUser.github,
          defraVpnId: cdpUser.defraVpnId,
          defraAwsId: cdpUser.defraAwsId
        })
      )
    })
    const json = await response.json()

    if (response.ok) {
      await setStepComplete(request, h, 'allSteps')

      request.yar.flash(sessionNames.notifications, {
        text: 'User created',
        type: 'success'
      })

      return h.redirect(config.get('appPathPrefix') + '/admin/users')
    }

    request.yar.flash(sessionNames.globalValidationFailures, json.message)

    return h.redirect(config.get('appPathPrefix') + '/admin/users/summary')
  }
}

export { createUserController }
