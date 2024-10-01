function transformFeaturesToEntityRows(features, logger) {
  logger.debug(features, 'Transforming features to entity rows')
  return [transformFeatureToEntityRow(features.createServiceDisabled, logger)]
}

function transformFeatureToEntityRow(feature, logger) {
  logger.debug(feature, 'Transforming feature to a entity row')
  return [
    {
      kind: 'text',
      value: feature.title
    },
    {
      kind: 'text',
      value: feature.enabled ? 'Enabled' : 'Not active'
    },
    ...(feature.enabled
      ? [
          {
            kind: 'text',
            value: ''
          },
          {
            kind: 'link',
            value: 'Expire',
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
