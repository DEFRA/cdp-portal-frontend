import { config } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'

const startCreateUserController = {
  handler: (request, h) => {
    request.yar.clear(sessionNames.cdpUser)
    request.yar.clear(sessionNames.validationFailure)

    return h.redirect(
      `${config.get('appPathPrefix')}/admin/users/find-aad-user`
    )
  }
}

export { startCreateUserController }
