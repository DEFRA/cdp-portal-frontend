import { testKind } from '~/src/server/test-suites/constants/test-kind.js'
import { renderTag } from '~/src/server/admin/permissions/helpers/render-tag.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'

function renderTestSuiteTagHtml(topics = []) {
  if (topics.includes(testKind.performance)) {
    return renderTag(formatText(testKind.performance), ['govuk-tag--green'])
  }

  if (topics.includes(testKind.journey)) {
    return renderTag(formatText(testKind.journey), ['govuk-tag--blue'])
  }

  return renderTag(formatText(testKind.testSuite), ['app-tag--purple'])
}

export { renderTestSuiteTagHtml }
