import { notApplicableValue } from '../../../common/constants/no-value.js'
import { buildLink } from '../../../common/helpers/view/build-link.js'
import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'
import { isFuture } from 'date-fns'

function transformScopeMembersToRows(scope) {
  const widthOneFifth = 'app-!-width-one-fifth'

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
            classes: widthOneFifth
          },
          {
            html: memberScope.teamId
              ? buildLink({
                  href: `/admin/teams/${memberScope.teamId}`,
                  text: `Team: ${memberScope.teamName}`,
                  newTab: false
                })
              : 'User',
            classes: widthOneFifth
          },
          {
            html: memberScope.startDate
              ? renderComponent('time', { datetime: memberScope.startDate })
              : notApplicableValue,
            classes: widthOneFifth
          },
          {
            html: memberScope.endDate
              ? renderComponent('time', { datetime: memberScope.endDate })
              : notApplicableValue,
            classes: widthOneFifth
          },
          {
            html: buildLink({
              href: `/admin/permissions/${scope.scopeId}/member/remove/${memberScope.userId}/team/${memberScope.teamId}`,
              text: 'Remove',
              newTab: false
            }),
            classes: `${widthOneFifth} govuk-table__header--numeric`
          }
        ]
      }
      return null
    })
    .filter(Boolean)
}

export { transformScopeMembersToRows }
