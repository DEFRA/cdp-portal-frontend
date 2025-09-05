import { renderComponent } from '../../../common/helpers/nunjucks/render-component.js'
import { noValue } from '../../../common/constants/no-value.js'
import { renderTag } from '../../../common/helpers/view/render-tag.js'

const editActionItems = (scopeId) => ({
  items: [
    {
      classes: 'app-link app-link--underline',
      href: `/admin/permissions/${scopeId}/edit`,
      text: 'Edit',
      visuallyHiddenText: 'Edit scope'
    }
  ]
})

function transformScopeToSummary(scope, withActions = true) {
  const editActions = editActionItems(scope.scopeId)
  const actions = withActions ? editActions : null

  const userTagComponent = renderComponent(
    'tool-tip',
    { text: 'A user permission is for an individual user' },
    [
      renderTag({
        text: 'User',
        classes: ['govuk-tag--green govuk-!-margin-bottom-1']
      })
    ]
  )
  const teamTagComponent = renderComponent(
    'tool-tip',
    { text: "A team permission includes all member's of a team" },
    [
      renderTag({
        text: 'Team',
        classes: ['govuk-tag--blue govuk-!-margin-bottom-1']
      })
    ]
  )
  const memberTagComponent = renderComponent(
    'tool-tip',
    { text: 'A member permission is for a user scoped to a team' },
    [
      renderTag({
        text: 'Member',
        classes: ['app-tag--purple']
      })
    ]
  )

  return {
    classes: 'app-summary-list',
    rows: [
      {
        key: { text: 'Value' },
        value: { text: scope.value }
      },
      {
        key: { text: 'Applicable to' },
        value: {
          html: scope.kind
            ? scope.kind
                ?.map((kind) => {
                  if (kind === 'user') {
                    return userTagComponent
                  }

                  if (kind === 'member') {
                    return memberTagComponent
                  }

                  return teamTagComponent
                })
                .sort()
                .join('')
            : noValue
        },
        actions
      },
      {
        key: { text: 'Description' },
        value: { text: scope.description ?? noValue },
        actions
      },
      {
        key: { text: 'Last Updated' },
        value: { html: renderComponent('time', { datetime: scope.updatedAt }) }
      },
      {
        key: { text: 'Created By' },
        value: { text: scope.createdBy.name }
      },
      {
        key: { text: 'Created' },
        value: {
          html: renderComponent('time', { datetime: scope.createdAt })
        }
      }
    ]
  }
}

export { transformScopeToSummary }
