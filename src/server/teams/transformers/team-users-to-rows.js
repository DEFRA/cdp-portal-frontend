import { buildLink } from '../../common/helpers/view/build-link.js'
import { renderIcon } from '../../common/helpers/nunjucks/render-component.js'

function buildProdAccessLink({ teamId }) {
  return ({ userId, hasProdAccess }) => {
    if (hasProdAccess) {
      return buildLink({
        classes: 'app-link--underline',
        href: `/teams/${teamId}/remove-prod-access/${userId}`,
        text: 'Remove prod access',
        newTab: false
      })
    }

    return buildLink({
      classes: 'app-link--underline',
      href: `/teams/${teamId}/grant-prod-access/${userId}`,
      text: 'Grant prod access',
      newTab: false
    })
  }
}

function transformTeamUsersToRows({
  team,
  withActions = false,
  hasCanGrantProdAccess = false
}) {
  const prodAccessLink = buildProdAccessLink(team)
  const emptyCell = { text: '' }

  return team.users.map((user) => {
    const iconClasses = ['app-icon--tiny', 'govuk-!-margin-right-1']
    const grandProdAccessLink = hasCanGrantProdAccess
      ? prodAccessLink(user)
      : ''

    const removeUserLink = buildLink({
      classes: `app-link--underline${hasCanGrantProdAccess ? ' app-link--with-seperator' : ''}`,
      href: `/teams/${team.teamId}/remove-member/${user.userId}`,
      text: 'Remove user',
      newTab: false
    })

    if (user?.hasProdAccess) {
      iconClasses.push('app-user-icon--prod-access')
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
              html: grandProdAccessLink + removeUserLink,
              classes: 'govuk-table__header--numeric'
            }
          ]
        : [emptyCell])
    ]
  })
}

export { transformTeamUsersToRows }
