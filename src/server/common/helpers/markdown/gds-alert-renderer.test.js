import { marked } from 'marked'
import markedAlert from 'marked-alert'
import { gdsAlertRenderer } from '~/src/server/common/helpers/markdown/gds-alert-renderer'

describe('#markedAlertGdsRenderer', () => {
  const markdownRenderer = marked.use(markedAlert()).use(gdsAlertRenderer())

  test('should generate GDS style alert boxes', () => {
    const html = markdownRenderer.parse(`> [!NOTE] This is a note alert`)

    expect(html).toContain(
      '<div class="govuk-notification-banner cdp-doc-alert-note" role="region" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">'
    )
    expect(html).toContain(
      '<p class="govuk-notification-banner__heading"><p> This is a note alert</p>'
    )
  })
})
