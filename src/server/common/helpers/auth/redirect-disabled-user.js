import { removeAuthenticatedUser } from './remove-authenticated-user.js'

function redirectDisabledUser(request, h) {
  if (request.path === '/account-disabled') {
    return h.continue
  }

  if (!request.auth?.isAuthenticated) {
    return h.continue
  }

  if (!request.auth.credentials?.isDisabled) {
    return h.continue
  }

  removeAuthenticatedUser(request)
  return h.redirect('/account-disabled').takeover()
}

export { redirectDisabledUser }
