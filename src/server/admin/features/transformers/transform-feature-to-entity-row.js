function transformFeaturesToEntityRows(features) {
  return [transformFeatureToEntityRow(features.createServiceDisabled)]
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
            kind: 'text',
            value: ''
          },
          {
            kind: 'link',
            value: 'Deactivate',
            url: feature.urlPrefix + '/expire'
          }
        ]
      : [
          {
            kind: 'link',
            value: 'Activate',
            url: feature.urlPrefix
          }
        ])
  ]
}

export { transformFeaturesToEntityRows, transformFeatureToEntityRow }
