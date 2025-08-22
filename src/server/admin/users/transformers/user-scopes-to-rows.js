import { buildLink } from '../../../common/helpers/view/build-link.js'
import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'
import { noValue } from '../../../common/constants/no-value.js'

// FIXME how are we going to display dates here?
function transformUserScopesToRows(team) {
  return team.scopes?.map((scope) => {
    return [
      {
        html: buildLink({
          href: `/admin/permissions/${scope.scopeId}`,
          text: scope.scopeName,
          newTab: false
        }),
        classes: 'govuk-!-width-one-quarter'
      },
      {
        html: scope.teamId
          ? buildLink({
              href: `/admin/teams/${scope.teamId}`,
              text: `Team: ${scope.teamName}`,
              newTab: false
            })
          : 'User',
        classes: 'govuk-!-width-one-quarter'
      },
      {
        html: scope.startDate
          ? renderComponent('time', { datetime: scope.startDate })
          : noValue,
        classes: 'govuk-!-width-one-quarter'
      },
      {
        html: scope.endDate
          ? renderComponent('time', { datetime: scope.endDate })
          : noValue,
        classes: 'govuk-!-width-one-quarter'
      }
    ]
  })
}

export { transformUserScopesToRows }
