import { buildLink } from '~/src/server/common/helpers/view/build-link.js'

function transformTeamUsersToTaskList(team, withActions = true) {
  const items = team.users.map((user) => {
    return {
      title: {
        html: buildLink(`/admin/users/${user.userId}`, user.name, false)
      },
      status: {
        classes: 'govuk-!-padding-right-1',
        html: withActions
          ? buildLink(
              `/admin/teams/${team.teamId}/remove-member/${user.userId}`,
              'Remove',
              false
            )
          : null
      }
    }
  })

  return {
    classes: 'app-task-list govuk-!-margin-bottom-8',
    attributes: { 'data-testid': 'admin-team-members' },
    items
  }
}

export { transformTeamUsersToTaskList }
