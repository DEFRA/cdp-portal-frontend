import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component.js'
import { formatText } from '~/src/config/nunjucks/filters/index.js'

const renderTag = (value, classes = []) =>
  renderComponent('tag', {
    text: formatText(value),
    classes: ['app-link--without-underline', ...classes].join(' '),
    attributes: {
      'data-testid': 'govuk-tag'
    }
  })

export { renderTag }
