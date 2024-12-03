import { noValue } from '~/src/server/common/constants/no-value.js'

function transformFeaturesToEntityRows(features) {
  if (!features) {
    return []
  }
  return features.map(transformFeatureToEntityRow)
}

function transformFeatureToEntityRow(feature) {
  return [
    {
      kind: 'text',
      value: feature.title
    },
    {
      kind: 'text',
      value: feature.enabled ? 'Active' : 'Not active'
    },
    ...(feature.enabled
      ? [
          {
            kind: 'date',
            value: feature.created
          },
          {
            kind: 'button',
            value: 'Deactivate',
            url: feature.urlPrefix + '/delete',
            classes: 'app-button--small app-button--destructive'
          }
        ]
      : [
          {
            kind: 'text',
            value: noValue
          },
          {
            kind: 'button',
            value: 'Activate',
            url: feature.urlPrefix,
            classes: 'app-button--small'
          }
        ])
  ]
}

export { transformFeaturesToEntityRows, transformFeatureToEntityRow }
