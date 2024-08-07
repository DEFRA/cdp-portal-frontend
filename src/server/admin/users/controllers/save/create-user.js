import { config } from '~/src/config'
import { provideCdpUser } from '~/src/server/admin/users/helpers/pre/provide-cdp-user'
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

    try {
      const { response } = await request.authedFetcher(createUserEndpointUrl, {
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

      if (response?.ok) {
        await setStepComplete(request, h, 'allSteps')

        request.yar.flash(sessionNames.notifications, {
          text: 'User created',
          type: 'success'
        })

        return h.redirect('/admin/users')
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/admin/users/summary')
    }
  }
}

export { createUserController }
