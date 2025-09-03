import { buildLink } from '../../../common/helpers/view/build-link.js'
import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'
import { notApplicableValue } from '../../../common/constants/no-value.js'

function transformUserScopesToRows(team) {
  const widthOneQuarter = 'govuk-!-width-one-quarter'

  return team.scopes?.map((scope) => {
    return [
      {
        html: buildLink({
          href: `/admin/permissions/${scope.scopeId}`,
          text: scope.scopeName,
          newTab: false
        }),
        classes: widthOneQuarter
      },
      {
        html: scope.teamId
          ? buildLink({
              href: `/admin/teams/${scope.teamId}`,
              text: `Team: ${scope.teamName}`,
              newTab: false
            })
          : 'User',
        classes: widthOneQuarter
      },
      {
        html: scope.startDate
          ? renderComponent('time', { datetime: scope.startDate })
          : notApplicableValue,
        classes: widthOneQuarter
      },
      {
        html: scope.endDate
          ? renderComponent('time', { datetime: scope.endDate })
          : notApplicableValue,
        classes: widthOneQuarter
      }
    ]
  })
}

export { transformUserScopesToRows }
