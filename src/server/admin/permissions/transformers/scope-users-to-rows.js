import qs from 'qs'

import { noValue } from '../../../common/constants/no-value.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'
import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'

function transformScopeUsersToRows(scope) {
  return scope.users.map((userScope) => {
    const queryString = userScope.teamId
      ? qs.stringify({ teamId: userScope.teamId }, { addQueryPrefix: true })
      : ''

    return [
      {
        html: buildLink({
          href: `/admin/users/${userScope.userId}`,
          text: userScope.userName,
          newTab: false
        }),
        classes: 'app-!-width-one-fifth'
      },
      {
        html: userScope.teamId
          ? buildLink({
              href: `/admin/teams/${userScope.teamId}`,
              text: `Team: ${userScope.teamName}`,
              newTab: false
            })
          : 'User',
        classes: 'app-!-width-one-fifth'
      },
      {
        html: userScope.startDate
          ? renderComponent('time', { datetime: userScope.startDate })
          : noValue,
        classes: 'app-!-width-one-fifth'
      },
      {
        html: userScope.endDate
          ? renderComponent('time', { datetime: userScope.endDate })
          : noValue,
        classes: 'app-!-width-one-fifth'
      },
      {
        html: buildLink({
          href: `/admin/permissions/${scope.scopeId}/user/remove/${userScope.userId}${queryString}`,
          text: 'Remove',
          newTab: false
        }),
        classes: 'app-!-width-one-fifth, govuk-table__header--numeric'
      }
    ]
  })
}

export { transformScopeUsersToRows }
