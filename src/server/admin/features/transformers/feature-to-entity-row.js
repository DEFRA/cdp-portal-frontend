function featureToEntityRow(feature) {
  const actionClasses = ['app-button--small']

  if (feature.active) {
    actionClasses.push('app-button--destructive')
  }

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
          value: feature.active ? 'Active' : 'Inactive',
          classes: feature.active ? 'govuk-tag--green' : 'govuk-tag--grey'
        }
      },
      {
        headers: 'actions',
        entity: {
          kind: 'button',
          value: feature.active ? 'Deactivate' : 'Activate',
          url: `/admin/features/${feature.id}/toggle/${!feature.active}`,
          classes: actionClasses.join(' ')
        }
      }
    ]
  }
}

export { featureToEntityRow }
