import { notApplicableValue } from '../../../common/constants/no-value.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'
import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'
import { isFuture } from 'date-fns'

function transformScopeMembersToRows(scope) {
  return scope.members
    ?.map((memberScope) => {
      if (memberScope.endDate === undefined || isFuture(memberScope.endDate)) {
        return [
          {
            html: buildLink({
              href: `/admin/users/${memberScope.userId}`,
              text: memberScope.userName,
              newTab: false
            }),
            classes: 'app-!-width-one-fifth'
          },
          {
            html: memberScope.teamId
              ? buildLink({
                  href: `/admin/teams/${memberScope.teamId}`,
                  text: `Team: ${memberScope.teamName}`,
                  newTab: false
                })
              : 'User',
            classes: 'app-!-width-one-fifth'
          },
          {
            html: memberScope.startDate
              ? renderComponent('time', { datetime: memberScope.startDate })
              : notApplicableValue,
            classes: 'app-!-width-one-fifth'
          },
          {
            html: memberScope.endDate
              ? renderComponent('time', { datetime: memberScope.endDate })
              : notApplicableValue,
            classes: 'app-!-width-one-fifth'
          },
          {
            html: buildLink({
              href: `/admin/permissions/${scope.scopeId}/member/remove/${memberScope.userId}/team/${memberScope.teamId}`,
              text: 'Remove',
              newTab: false
            }),
            classes: 'app-!-width-one-fifth, govuk-table__header--numeric'
          }
        ]
      }
      return null
    })
    .filter(Boolean)
}

export { transformScopeMembersToRows }
