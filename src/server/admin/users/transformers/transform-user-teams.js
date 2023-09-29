import { config } from '~/src/config'
import { sortBy } from '~/src/server/common/helpers/sort-by'

function transformUserTeams(user) {
  const appPathPrefix = config.get('appPathPrefix')

  return user.teams
    .map((team) => {
      const teamHref = appPathPrefix + '/admin/teams/' + team.teamId

      return {
        ...team,
        content: {
          html: `<a class="app-link" href="${teamHref}">${team.name}</a>`
        }
      }
    })
    .sort(sortBy('name', 'asc'))
}

export { transformUserTeams }
