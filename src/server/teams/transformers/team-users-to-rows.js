import { buildLink } from '../../common/helpers/view/build-link.js'
import { renderIcon } from '../../common/helpers/nunjucks/render-component.js'

function transformTeamUsersToRows({
  team,
  withActions = false,
  hasCanGrantProdAccess
}) {
  return team.users.map((user, i) => {
    const grandProdAccessLink = hasCanGrantProdAccess
      ? buildLink({
          classes: 'app-link--underline',
          href: `/teams/${team.teamId}/users/${user.userId}/add-prod-access`,
          text: 'Grant prod access',
          newTab: false
        })
      : ''
    const removeUserLink = buildLink({
      classes: `app-link--underline${hasCanGrantProdAccess ? ' app-link--with-seperator' : ''}`,
      href: `/teams/${team.teamId}/remove-member/${user.userId}`,
      text: 'Remove user',
      newTab: false
    })

    return [
      {
        html: `<div class="app-!-layout-flex-start">
                ${renderIcon('user-icon', { classes: 'app-icon--minuscule govuk-!-margin-right-1' })}${user.name}
              </div>`
      },
      ...(withActions
        ? [
            {
              html: grandProdAccessLink + removeUserLink,
              classes: 'govuk-table__header--numeric'
            }
          ]
        : [{ html: '' }])
    ]
  })
}

export { transformTeamUsersToRows }
