import fetch from 'node-fetch'

import { appConfig } from '~/src/config'
import { provideCdpUser } from '~/src/server/admin/users/helpers/prerequisites/provide-cdp-user'
import { noSessionRedirect } from '~/src/server/admin/users/helpers/prerequisites/no-session-redirect'
import { saveToCdpUser } from '~/src/server/admin/users/helpers/save-to-cdp-user'
import { sessionNames } from '~/src/server/common/constants/session-names'

const createUserController = {
  options: {
    pre: [noSessionRedirect, provideCdpUser]
  },
  handler: async (request, h) => {
    const cdpUser = request.pre?.cdpUser
    const createUserEndpointUrl = `${appConfig.get('userServiceApiUrl')}/users`

    const response = await fetch(createUserEndpointUrl, {
      method: 'post',
      body: JSON.stringify({
        userId: cdpUser.userId,
        name: cdpUser.name,
        email: cdpUser.email,
        github: cdpUser.github,
        defraVpnId: cdpUser.defraVpnId,
        defraAwsId: cdpUser.defraAwsId
      }),
      headers: { 'Content-Type': 'application/json' }
    }).then((response) => response.json())

    if (response.ok) {
      saveToCdpUser(request, { isComplete: true })

      request.yar.flash(sessionNames.notifications, {
        text: 'User created',
        type: 'success'
      })

      return h.redirect(appConfig.get('appPathPrefix') + '/admin/users')
    }

    request.yar.flash(sessionNames.globalValidationFailures, response.message)

    return h.redirect(
      appConfig.get('appPathPrefix') + '/admin/users/create/summary'
    )
  }
}

export { createUserController }
