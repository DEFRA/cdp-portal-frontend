import { renderTag } from '../../../../common/helpers/view/render-tag.js'
import { entitySubTypes } from '@defra/cdp-validation-kit'

function renderTestSuiteTagHtml(testSuite) {
  let classes

  switch (testSuite.subType) {
    case entitySubTypes.performance:
      classes = ['govuk-tag--green']
      break
    case entitySubTypes.journey:
      classes = ['govuk-tag--blue']
      break
    default:
      classes = ['app-tag--purple']
  }

  return renderTag({
    text: testSuite.subType,
    classes
  })
}

export { renderTestSuiteTagHtml }
