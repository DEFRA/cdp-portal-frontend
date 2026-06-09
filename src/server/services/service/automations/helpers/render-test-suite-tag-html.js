import { entitySubTypes } from '@defra/cdp-validation-kit'

function renderTestSuiteTagHtml(testSuite) {
  let classes

  switch (testSuite?.subType) {
    case entitySubTypes.performance:
      classes = ['govuk-tag--green']
      break
    case entitySubTypes.journey:
      classes = ['govuk-tag--blue']
      break
    default:
      classes = ['govuk-tag--grey']
  }

  const text = testSuite?.subType ?? 'Unknown'

  return `<strong class="govuk-tag app-tag ${classes.join(' ')}" data-testid="govuk-tag">${text}</strong>\n`
}

export { renderTestSuiteTagHtml }
