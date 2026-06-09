import { renderTestSuiteTagHtml } from '#server/services/service/automations/helpers/render-test-suite-tag-html.js'
import { entitySubTypes } from '@defra/cdp-validation-kit'

describe('Render test suite tag', () => {
  test('Should use the correct tag based on subtype', () => {
    const tagJourney = renderTestSuiteTagHtml({
      subType: entitySubTypes.journey
    })
    const tagPerf = renderTestSuiteTagHtml({
      subType: entitySubTypes.performance
    })

    expect(tagJourney.trim()).toEqual(
      '<strong class="govuk-tag app-tag govuk-tag--blue" data-testid="govuk-tag">Journey</strong>'
    )

    expect(tagPerf.trim()).toEqual(
      '<strong class="govuk-tag app-tag govuk-tag--green" data-testid="govuk-tag">Performance</strong>'
    )
  })

  test('Should handle unknown entities', () => {
    const unknownTag = renderTestSuiteTagHtml(null)
    expect(unknownTag.trim()).toEqual(
      '<strong class="govuk-tag app-tag govuk-tag--grey" data-testid="govuk-tag">Unknown</strong>'
    )
  })
})
