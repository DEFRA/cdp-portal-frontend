import { sessionNames } from '../../../../common/constants/session-names.js'

const startCreateUserController = {
  options: {
    id: 'admin/users/create'
  },
  handler: async (request, h) => {
    request.yar.clear(sessionNames.validationFailure)
    request.yar.set(sessionNames.cdpUser, {})
    return h.redirect('/admin/users/find-aad-user')
  }
}

export { startCreateUserController }
