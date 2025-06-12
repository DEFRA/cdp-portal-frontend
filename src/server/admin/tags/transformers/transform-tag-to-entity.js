const tags = {
  'tier-1': {
    description: 'Service has Tier 1 support coverage',
    entity: {
      kind: 'tag',
      classes: 'govuk-tag--green',
      value: 'Tier 1',
      attributes: {
        title: 'Tier 1 support coverage'
      }
    }
  },
  'prr': {
    displayName: 'Service has passed its Platform Readiness Review',
    entity: {
      kind: 'tag',
      classes: 'govuk-tag--orange',
      value: 'PRR',
      attributes: {
        title: 'PRR Pass'
      }
    }
  }
}

export function tagToEntity(tag) {
  return tags[tag.toLowerCase()]?.entity
}
