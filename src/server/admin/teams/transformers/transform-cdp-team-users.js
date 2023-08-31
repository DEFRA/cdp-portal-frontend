import { appConfig } from '~/src/config'
import { sortBy } from '~/src/server/common/helpers/sort-by'

function transformCdpTeamUsers(team) {
  const appPathPrefix = appConfig.get('appPathPrefix')

  return team.users
    .map((user) => {
      const userHref = appPathPrefix + '/admin/users/' + user.userId
      const formAction =
        appPathPrefix + `/admin/teams/${team.teamId}/remove-user/${user.userId}`

      return {
        ...user,
        content: {
          html: `<a class="app-link" href="${userHref}">${user.name}</a>`
        },
        action: {
          html: `<button class="govuk-button app-button app-button--small app-button--destructive"formaction="${formAction}">Remove</button>`
        }
      }
    })
    .sort(sortBy('name', 'asc'))
}

export { transformCdpTeamUsers }
