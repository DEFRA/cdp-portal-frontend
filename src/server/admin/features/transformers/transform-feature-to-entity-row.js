import { noValue } from '~/src/server/common/constants/no-value.js'

function transformFeaturesToEntityRows(features) {
  if (!features) {
    return []
  }
  return features.map(transformFeatureToEntityRow)
}

function transformFeatureToEntityRow(feature) {
  return {
    cells: [
      {
        headers: 'feature',
        entity: { kind: 'text', value: feature.title }
      },
      {
        headers: 'status',
        entity: {
          kind: 'text',
          value: feature.enabled ? 'Active' : 'Not active'
        }
      },
      ...(feature.enabled
        ? [
            {
              headers: 'activated',
              entity: {
                kind: 'date',
                value: feature.created
              }
            },
            {
              headers: 'actions',
              entity: {
                kind: 'button',
                value: 'Deactivate',
                url: feature.urlPrefix + '/delete',
                classes: 'app-button--small app-button--destructive'
              }
            }
          ]
        : [
            {
              headers: 'activated',
              entity: {
                kind: 'text',
                value: noValue
              }
            },
            {
              headers: 'actions',
              entity: {
                kind: 'button',
                value: 'Activate',
                url: feature.urlPrefix,
                classes: 'app-button--small'
              }
            }
          ])
    ]
  }
}

export { transformFeaturesToEntityRows, transformFeatureToEntityRow }
