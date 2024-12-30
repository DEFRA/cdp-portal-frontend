import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { renderIcon } from '~/src/server/common/helpers/nunjucks/render-component.js'

function transformTeamUsersToTaskList(team, withActions = false) {
  const items = team.users.map((user) => {
    return {
      title: {
        html: `<div class="app-!-layout-centered">${
          renderIcon('user-icon', {
            classes: 'app-icon--minute govuk-!-margin-right-1'
          }) + user.name
        }</div>`
      },
      status: {
        classes: 'govuk-!-padding-right-1',
        html: withActions
          ? buildLink(
              `/teams/${team.teamId}/remove-member/${user.userId}`,
              'Remove',
              false
            )
          : null
      }
    }
  })

  return {
    classes: 'app-task-list govuk-!-margin-bottom-0',
    attributes: { 'data-testid': 'team-members' },
    items
  }
}

export { transformTeamUsersToTaskList }
