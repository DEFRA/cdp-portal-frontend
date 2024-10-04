/**
 * Overrides the renderer from the `marked-alerts` extension to render a GDS style alert box.
 */
export function gdsAlertRenderer() {
  return {
    extensions: [
      {
        name: 'alert',
        level: 'block',
        renderer({ meta, tokens }) {
          return `<div class="govuk-notification-banner cdp-doc-alert-${meta.variant}" role="region" aria-labelledby="govuk-notification-banner-title" data-module="govuk-notification-banner">
  <div class="govuk-notification-banner__header cdp-doc-alert-header-${meta.variant}">
    <h2 class="govuk-notification-banner__title" id="govuk-notification-banner-title">${meta.title}</h2>
  </div>
  <div class="govuk-notification-banner__content">
    <p class="govuk-notification-banner__heading">${this.parser.parse(tokens)}</p>
  </div>
</div>`
        }
      }
    ]
  }
}
