import { buildLink } from '~/src/server/common/helpers/build-link.js'

function transformUserScopesToTaskList(team) {
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

export { transformUserScopesToTaskList }