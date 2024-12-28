import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'

const renderTag = (value, classes = []) =>
  renderComponent('tag', {
    text: value,
    classes: ['app-link--without-underline', ...classes].join(' '),
    attributes: {
      'data-testid': 'govuk-tag'
    }
  })

export { renderTag }
