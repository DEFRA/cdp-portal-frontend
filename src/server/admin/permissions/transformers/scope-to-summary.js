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
                ?.map((k) => {
                  if (k === 'user') {
                    return renderTag({
                      text: 'user',
                      classes: ['govuk-tag--green', 'govuk-!-margin-right-1']
                    })
                  }

                  return renderTag({
                    text: 'team',
                    classes: ['govuk-tag--blue', 'govuk-!-margin-right-1']
                  })
                })
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
