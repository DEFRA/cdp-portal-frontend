import { testKind } from '~/src/server/test-suites/constants/test-kind.js'
import { renderTag } from '~/src/server/common/helpers/view/render-tag.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'

function renderTestSuiteTagHtml(topics = []) {
  if (topics.includes(testKind.performance)) {
    return renderTag({
      text: formatText(testKind.performance),
      classes: ['govuk-tag--green']
    })
  }

  if (topics.includes(testKind.journey)) {
    return renderTag({
      text: formatText(testKind.journey),
      classes: ['govuk-tag--blue']
    })
  }

  return renderTag({
    text: formatText(testKind.testSuite),
    classes: ['app-tag--purple']
  })
}

export { renderTestSuiteTagHtml }
