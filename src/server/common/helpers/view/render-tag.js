import { renderComponent } from '../nunjucks/render-component.js'

/**
 * @typedef {object} Params
 * @property {string} text
 * @property {string|string[]} [classes] - tag classes, space seperated string or array of classes
 * @property {boolean} [isLoading] - add a loading spinner to the tag
 * @property {string} [url] - wrap the tag in an anchor
 * @property {Record<string, string>} [attributes] - additional attributes for the tag
 */

/**
 * Helper wrapper for appTag
 * @param {Params} params
 * @returns {string}
 */
export function renderTag(params = {}) {
  const text = params.text
  const loaderClasses = []
  const attributes = params.attributes ?? {}

  const classes = params.classes ?? []
  const classesArray = Array.isArray(classes) ? classes : classes.split(' ')

  if (params.url) {
    classes.push('app-link--without-underline')
  }

  return renderComponent('tag', {
    ...params,
    text,
    classes: classesArray.join(' '),
    attributes: {
      'data-testid': 'govuk-tag',
      ...attributes
    },
    loaderClasses
  })
}
