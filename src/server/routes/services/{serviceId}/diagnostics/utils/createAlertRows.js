import { formatText } from '#config/nunjucks/filters/filters.js'

export default function createAlertRows(alerts, environment, showPromote) {
  return alerts
    .sort(
      (a, b) =>
        orderCustomLast(a)?.localeCompare(orderCustomLast(b), 'en-GB') ||
        a.name?.localeCompare(b.name, 'en-GB')
    )
    .map(
      ({
        name,
        type,
        uid,
        version,
        promoted,
        promotion_request,
        // TODO: Missing url
        url = `https://metrics.${environment}.cdp-int.defra.cloud/alerting/grafana/${uid}/view`,
        annotations
      }) => [
        { text: formatText(type) },
        {
          html: `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`
        },
        {
          html: version ? formatText(version) : '-'
        },
        {
          html: annotations?.runbook_url
            ? `<a href="${annotations.runbook_url}" target="_blank" rel="noopener noreferrer">Runbook</a>`
            : '- - -'
        },
        ...(showPromote
          ? [
              {
                html: promoted
                  ? '<strong class="govuk-tag app-tag">Current</span></strong>'
                  : promotion_request
                    ? '<strong class="govuk-tag app-tag app-tag--with-loader">Promoting<span class="app-loader govuk-!-margin-left-1 app-loader--small  app-loader--is-loading" data-testid="app-loader"></span></strong>'
                    : `<a href="./dev/alerts/promote/${uid}">Promote</a>`
              }
            ]
          : [])
      ]
    )
}

function orderCustomLast(alert) {
  return alert.type === 'custom' ? 'ZZZ' : alert.type
}
