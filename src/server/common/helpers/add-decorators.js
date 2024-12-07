import { isXhr } from '~/src/server/common/helpers/is-xhr.js'
import { routeLookupDecorator } from '~/src/server/common/helpers/route-lookup/index.js'
import { authedFetcherDecorator } from '~/src/server/common/helpers/fetch/authed-fetcher.js'
import { getUserSession } from '~/src/server/common/helpers/auth/get-user-session.js'
import { dropUserSession } from '~/src/server/common/helpers/auth/drop-user-session.js'
import { userIsTeamMemberDecorator } from '~/src/server/common/helpers/user/user-is-team-member.js'
import { userIsMemberOfATeamDecorator } from '~/src/server/common/helpers/user/user-is-member-of-a-team.js'
import { userIsServiceOwnerDecorator } from '~/src/server/common/helpers/user/user-is-service-owner.js'

/**
 * Add global server methods
 * @param {import('@hapi/hapi').Server} server
 */
function addDecorators(server) {
  server.decorate('request', 'isXhr', isXhr)
  server.decorate('request', 'authedFetcher', authedFetcherDecorator, {
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
  server.decorate('request', 'featureToggles', server.app.featureToggles)
}

export { addDecorators }
