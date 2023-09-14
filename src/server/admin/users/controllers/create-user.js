import { appConfig } from '~/src/config'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { setStepComplete } from '~/src/server/admin/users/helpers/set-step-complete'
import { removeNil } from '~/src/server/common/helpers/remove-nil'
import { fetchWithAuth } from '~/src/server/common/helpers/fetch-with-auth'

const createUserController = {
  options: {
    pre: [noSessionRedirect, provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser
    const createUserEndpointUrl = `${appConfig.get('userServiceApiUrl')}/users`

    const response = await fetchWithAuth(
      request.yar?.auth,
      createUserEndpointUrl,
      {
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
      }
    )
    const json = await response.json()

    if (response.ok) {
      setStepComplete(request, 'allSteps')

      request.yar.flash(sessionNames.notifications, {
        text: 'User created',
        type: 'success'
      })

      return h.redirect(appConfig.get('appPathPrefix') + '/admin/users')
    }

    request.yar.flash(sessionNames.globalValidationFailures, json.message)

    return h.redirect(appConfig.get('appPathPrefix') + '/admin/users/summary')
  }
}

export { createUserController }
