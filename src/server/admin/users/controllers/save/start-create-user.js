import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToCdpUser } from '~/src/server/admin/users/helpers/form'

const startCreateUserController = {
  options: {
    id: 'admin/users/create'
  },
  handler: async (request, h) => {
    request.yar.clear(sessionNames.cdpUser)
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    await saveToCdpUser(request, h, {})

    return h.redirect('/admin/users/find-aad-user')
  }
}

export { startCreateUserController }
