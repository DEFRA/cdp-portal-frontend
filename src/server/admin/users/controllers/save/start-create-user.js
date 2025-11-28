import { sessionNames } from '../../../../common/constants/session-names.js'

const startCreateUserController = {
  options: {
    id: 'admin/users/create'
  },
  handler: async (request, h) => {
    request.yar.clear(sessionNames.cdpUser)
    request.yar.clear(sessionNames.validationFailure)
    return h.redirect('/admin/users/find-aad-user')
  }
}

export { startCreateUserController }
