import { buildLink } from '~/src/server/common/helpers/view/build-link.js'

function transformTeamScopesToTaskList(team) {
  const items =
    team.scopes?.map((scope) => {
      return {
        title: {
          html: buildLink(
            `/admin/permissions/${scope.scopeId}`,
            scope.value,
            false
          )
        }
      }
    }) ?? []

  return { classes: 'app-task-list govuk-!-margin-bottom-8', items }
}

export { transformTeamScopesToTaskList }
