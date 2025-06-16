import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'

/**
 * List of tags that can be applied to a service.
 * @type {Map<string, {colour: string, displayName: string, name: string, description: string}>}
 */
export const serviceTags = {
  'tier-1': {
    name: 'tier-1',
    displayName: 'Tier 1',
    description: 'Service has Tier 1 support coverage.',
    colour: 'purple'
  },
  live: {
    name: 'live',
    displayName: 'Live',
    description: 'Service is live and available to the public.',
    colour: 'green'
  },
  beta: {
    name: 'beta',
    displayName: 'Beta',
    description: 'Service is like but in public/private beta',
    colour: 'yellow'
  },
  prr: {
    name: 'prr',
    displayName: 'PRR',
    description: 'Service has passed it PRR',
    colour: 'orange'
  }
}

/**
 * Returns an HTML representation of a tag.
 * Takes either the name of a valid tag or a tag object.
 * If the tag name is invalid it returns null.
 * @param {string|{name:string, displayName:string, description:string, colour: string}} tagOrName
 * @returns {string|null}
 */
export function renderServiceTag(tagOrName) {
  const tag =
    typeof tagOrName === 'string'
      ? serviceTags[tagOrName.toLowerCase()]
      : tagOrName

  if (!tag) {
    return null
  }

  return renderTag(tag.displayName, [`govuk-tag--${tag.colour}`])
}
