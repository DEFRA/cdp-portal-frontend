import Boom from '@hapi/boom'
import { userIsAdminOrBetaTester } from '#server/common/helpers/user/user-is-admin-or-beta-tester.js'

export function requireAdminOrBetaTester(request, h) {
  if (userIsAdminOrBetaTester(request.auth.credentials?.scope)) {
    return h.continue
  }

  return Boom.forbidden('Imports are restricted to admins and beta testers')
}
