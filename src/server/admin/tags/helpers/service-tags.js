/**
 * List of tags that can be applied to a service.
 * @type {Map<string, {className: string, displayName: string, name: string, description: string}>}
 */
const serviceTags = {
  'tier-1': {
    name: 'tier-1',
    displayName: 'Tier 1',
    description: 'Service has Tier 1 support coverage.',
    className: 'govuk-tag--purple'
  },
  live: {
    name: 'live',
    displayName: 'Live',
    description: 'Service is live and available to the public.',
    className: 'govuk-tag--green'
  },
  beta: {
    name: 'beta',
    displayName: 'Beta',
    description: 'Service is live but in public/private beta',
    className: 'govuk-tag--light-blue'
  },
  prr: {
    name: 'prr',
    displayName: 'PRR',
    description: 'Service has passed it PRR',
    className: 'govuk-tag--turquoise'
  }
}

export { serviceTags }
