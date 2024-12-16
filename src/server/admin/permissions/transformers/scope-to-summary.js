import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { noValue } from '~/src/server/common/constants/no-value.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'

const editActionItems = (scopeId) => ({
  classes: 'govuk-!-padding-right-1',
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
    classes: 'app-summary-list govuk-!-margin-bottom-8',
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
                    return renderTag('user', [
                      'govuk-tag--green',
                      'govuk-!-margin-right-1'
                    ])
                  }

                  return renderTag('team', [
                    'govuk-tag--blue',
                    'govuk-!-margin-right-1'
                  ])
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
