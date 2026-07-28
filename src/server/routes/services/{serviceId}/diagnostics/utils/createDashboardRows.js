import { formatText } from '#config/nunjucks/filters/filters.js'

export default function createDashboardRows(metrics, showPromote) {
  const dashboards = Object.entries(metrics)
    .flatMap(([_, dashboard]) => dashboard)
    .map((dashboard) => ({
      ...dashboard,
      name: dashboard.title ?? dashboard.url.split('/').at(-1)
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en-GB'))

  return dashboards.map(
    ({
      name,
      type = 'custom',
      version,
      url,
      uid,
      promoted,
      promotion_request
    }) => [
      { text: formatText(type) },
      {
        html: `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`
      },
      { text: version },
      ...(showPromote
        ? [
            {
              html: promoted
                ? '<strong class="govuk-tag app-tag">Current</span></strong>'
                : promotion_request
                  ? '<strong class="govuk-tag app-tag app-tag--with-loader">Promoting<span class="app-loader govuk-!-margin-left-1 app-loader--small  app-loader--is-loading" data-testid="app-loader"></span></strong>'
                  : `<a href="./dev/dashboards/promote/${uid}">Promote</a>`
            }
          ]
        : [])
    ]
  )
}
