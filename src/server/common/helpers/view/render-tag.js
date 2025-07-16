import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'

/**
 * @typedef {object} Params
 * @property {string} text
 * @property {string} [classes] - tag classes
 * @property {boolean} isLoading - add a loading spinner to the tag
 * @property {string} url - wrap the tag in an anchor
 */

/**
 * Helper wrapper for appTag
 * @param {Params} params
 * @returns {string}
 */
export function renderTag(params = {}) {
  const text = params.text
  const classes = params.classes ?? []
  const loaderClasses = []

  if (params.isLoading) {
    loaderClasses.push('app-loader--is-loading')
  }

  if (params.url) {
    classes.push('app-link--without-underline')
  }

  return renderComponent('tag', {
    ...params,
    text,
    classes: classes.join(' '),
    attributes: {
      'data-testid': 'govuk-tag',
      ...(params.attributes && params.attributes)
    },
    loaderClasses
  })
}
