import { buildLink } from '~/src/server/common/helpers/build-link.js'

function transformScopeTeamsToTaskList(scope, withActions = true) {
  const items = scope.teams.map((team) => {
    return {
      title: {
        html: buildLink(`/admin/teams/${team.teamId}`, team.name, false)
      },
      status: {
        classes: 'govuk-!-padding-right-1',
        html: withActions
          ? buildLink(
              `/admin/permissions/${scope.scopeId}/remove/${team.teamId}`,
              'Remove',
              false
            )
          : null
      }
    }
  })

  return { classes: 'app-task-list', items }
}

export { transformScopeTeamsToTaskList }
