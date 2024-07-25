import { isXhr } from '~/src/server/common/helpers/is-xhr'
import { routeLookupDecorator } from '~/src/server/common/helpers/route-lookup'
import { authedFetcher } from '~/src/server/common/helpers/fetch/authed-fetcher'
import { getUserSession } from '~/src/server/common/helpers/auth/get-user-session'
import { dropUserSession } from '~/src/server/common/helpers/auth/drop-user-session'
import { userIsTeamMemberDecorator } from '~/src/server/common/helpers/user/user-is-team-member'
import { userIsMemberOfATeamDecorator } from '~/src/server/common/helpers/user/user-is-member-of-a-team'
import { userIsServiceOwnerDecorator } from '~/src/server/common/helpers/user/user-is-service-owner'

/**
 * Add global server methods
 * @param server {Server}
 */
function addDecorators(server) {
  server.decorate('request', 'isXhr', isXhr)
  server.decorate('request', 'authedFetcher', authedFetcher, {
    apply: true
  })
  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)
  server.decorate('request', 'userIsTeamMember', userIsTeamMemberDecorator, {
    apply: true
  })
  server.decorate(
    'request',
    'userIsMemberOfATeam',
    userIsMemberOfATeamDecorator,
    { apply: true }
  )
  server.decorate(
    'request',
    'userIsServiceOwner',
    userIsServiceOwnerDecorator,
    { apply: true }
  )
  server.decorate('request', 'routeLookup', routeLookupDecorator, {
    apply: true
  })
}

export { addDecorators }

/**
 * import { Server } from '@hapi/hapi'
 */
