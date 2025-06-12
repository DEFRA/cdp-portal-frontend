import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import Joi from 'joi'

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
    description: 'Service has passed its Platform Readiness Review',
    colour: 'green'
  }
}

export const validServiceTags = Joi.string().valid(...Object.keys(serviceTags))

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

  return renderComponent('tag', {
    text: tag.displayName,
    classes: `govuk-tag--${tag.colour}`,
    attributes: { 'data-testid': 'govuk-tag' }
  })
}
