import { isXhr } from './is-xhr.js'
import { routeLookupDecorator } from './route-lookup/index.js'
import { authedFetchJsonDecorator } from './fetch/authed-fetch-json.js'
import { getUserSession } from './auth/get-user-session.js'
import { dropUserSession } from './auth/drop-user-session.js'
import { userIsServiceOwnerDecorator } from './user/user-is-service-owner.js'
import { hasScopeDecorator } from './decorators/has-scope.js'
import { userIsAdminDecorator } from './user/user-is-admin.js'
import { userIsTenantDecorator } from './user/user-is-tenant.js'
import { userIsOwnerDecorator } from './user/user-is-owner.js'

/**
 * Add global server methods
 * @param {import('@hapi/hapi').Server} server
 */
function addDecorators(server) {
  server.decorate('request', 'isXhr', isXhr)
  server.decorate('request', 'authedFetchJson', authedFetchJsonDecorator, {
    apply: true
  })
  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)
  server.decorate('request', 'userIsOwner', userIsOwnerDecorator, {
    apply: true
  })
  server.decorate(
    'request',
    'userIsServiceOwner',
    userIsServiceOwnerDecorator,
    { apply: true }
  )
  server.decorate('request', 'userIsAdmin', userIsAdminDecorator, {
    apply: true
  })
  server.decorate('request', 'userIsTenant', userIsTenantDecorator, {
    apply: true
  })
  server.decorate('request', 'routeLookup', routeLookupDecorator, {
    apply: true
  })
  server.decorate('request', 'hasScope', hasScopeDecorator, {
    apply: true
  })
}

export { addDecorators }
