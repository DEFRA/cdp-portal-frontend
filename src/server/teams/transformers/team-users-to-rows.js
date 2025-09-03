import { buildLink } from '../../common/helpers/view/build-link.js'
import { renderIcon } from '../../common/helpers/nunjucks/render-component.js'

function buildBreakGlassLink({ teamId }) {
  return ({ userId, hasBreakGlass }) => {
    if (hasBreakGlass) {
      return buildLink({
        classes: 'app-link--underline',
        href: `/teams/${teamId}/remove-break-glass/${userId}`,
        text: 'Remove break glass',
        newTab: false
      })
    }

    return buildLink({
      classes: 'app-link--underline',
      href: `/teams/${teamId}/grant-break-glass/${userId}`,
      text: 'Grant break glass',
      newTab: false
    })
  }
}

function transformTeamUsersToRows({
  team,
  withActions = false,
  hasCanGrantBreakGlass = false
}) {
  const breakGlassLink = buildBreakGlassLink(team)
  const emptyCell = { text: '' }

  return team.users.map((user) => {
    const iconClasses = ['app-icon--minuscule', 'govuk-!-margin-right-1']
    const grandBreakGlassLink = hasCanGrantBreakGlass
      ? breakGlassLink(user)
      : ''

    const removeUserLink = buildLink({
      classes: `app-link--underline${hasCanGrantBreakGlass ? ' app-link--with-seperator' : ''}`,
      href: `/teams/${team.teamId}/remove-member/${user.userId}`,
      text: 'Remove user',
      newTab: false
    })

    if (user?.hasBreakGlass) {
      iconClasses.push('app-user-icon--elevated-permissions')
    }

    return [
      {
        html: `<div class="app-!-layout-centered">
                ${renderIcon('user-icon', { classes: iconClasses.join(' ') })}${user.name}
              </div>`
      },
      ...(withActions
        ? [
            {
              html: grandBreakGlassLink + removeUserLink,
              classes: 'govuk-table__header--numeric'
            }
          ]
        : [emptyCell])
    ]
  })
}

export { transformTeamUsersToRows }
