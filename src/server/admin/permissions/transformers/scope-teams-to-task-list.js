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
              `/admin/permissions/${scope.scopeId}/team/remove/${team.teamId}`,
              'Remove',
              false
            )
          : null
      }
    }
  })

  return { classes: 'app-task-list govuk-!-margin-bottom-8', items }
}

export { transformScopeTeamsToTaskList }
