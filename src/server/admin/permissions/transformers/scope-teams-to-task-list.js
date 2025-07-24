import { buildLink } from '../../../common/helpers/view/build-link.js'

function transformScopeTeamsToTaskList(scope, withActions = true) {
  const items = scope.teams.map((team) => {
    return {
      title: {
        html: buildLink({
          href: `/admin/teams/${team.teamId}`,
          text: team.name,
          newTab: false
        })
      },
      status: {
        html: withActions
          ? buildLink({
              href: `/admin/permissions/${scope.scopeId}/team/remove/${team.teamId}`,
              text: 'Remove',
              newTab: false
            })
          : null
      }
    }
  })

  return { classes: 'app-task-list', items }
}

export { transformScopeTeamsToTaskList }
