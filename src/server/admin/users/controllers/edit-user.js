import { appConfig } from '~/src/config'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/admin/users/helpers/set-step-complete'
import { fetchWithAuth } from '~/src/server/common/helpers/fetch-with-auth'

const editUserController = {
  options: {
    pre: [noSessionRedirect, provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser
    const editUserEndpointUrl = `${appConfig.get('userServiceApiUrl')}/users/${
      cdpUser.userId
    }`

    const response = await fetchWithAuth(
      request.yar?.auth,
      editUserEndpointUrl,
      {
        method: 'patch',
        body: JSON.stringify({
          name: cdpUser.name,
          email: cdpUser.email,
          github: cdpUser.github,
          defraVpnId: cdpUser.defraVpnId,
          defraAwsId: cdpUser.defraAwsId
        })
      }
    )
    const json = await response.json()

    if (response.ok) {
      setStepComplete(request, 'allSteps')

      request.yar.flash(sessionNames.notifications, {
        text: 'User updated',
        type: 'success'
      })

      return h.redirect(
        appConfig.get('appPathPrefix') + '/admin/users/' + cdpUser.userId
      )
    }

    request.yar.flash(sessionNames.globalValidationFailures, json.message)

    return h.redirect(appConfig.get('appPathPrefix') + '/admin/users/summary')
  }
}

export { editUserController }
