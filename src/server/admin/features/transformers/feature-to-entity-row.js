import { noValue } from '~/src/server/common/constants/no-value.js'

function featureToEntityRow(feature) {
  const actionClasses = ['app-button--small']

  if (feature.enabled) {
    actionClasses.push('app-button--destructive')
  }

  const enabledEntity = feature.enabled
    ? { entity: { kind: 'date', value: feature.enabledAt } }
    : { entity: { kind: 'text', value: noValue } }

  const expiresEntity = feature.enabled
    ? { entity: { kind: 'date', value: feature.expiresAt } }
    : { entity: { kind: 'text', value: noValue } }

  return {
    cells: [
      {
        headers: 'feature',
        entity: { kind: 'text', value: feature.name }
      },
      {
        headers: 'url',
        entity: {
          kind: 'link',
          value: feature.url,
          url: feature.url
        }
      },
      {
        headers: 'status',
        entity: {
          kind: 'tag',
          value: feature.enabled ? 'Enabled' : 'Disabled',
          classes: feature.enabled ? 'govuk-tag--green' : 'govuk-tag--grey'
        }
      },
      {
        headers: 'enabled',
        ...enabledEntity
      },
      {
        headers: 'expires',
        ...expiresEntity
      },
      {
        headers: 'actions',
        entity: {
          kind: 'button',
          value: feature.enabled ? 'Disable' : 'Enable',
          url: `/admin/features/${feature.id}/toggle`,
          classes: actionClasses.join(' ')
        }
      }
    ]
  }
}

export { featureToEntityRow }
