import { formatText } from '#config/nunjucks/filters/filters.js'

export default function createAlertRows(alerts, environment) {
  return alerts
    .sort((a, b) => a.name.localeCompare(b.name, 'en-GB'))
    .map(
      ({
        name,
        type,
        uid,
        // TODO: Missing url
        url = `https://metrics.${environment}.cdp-int.defra.cloud/alerting/grafana/${uid}/view`,
        annotations
      }) => [
        { text: formatText(type) },
        {
          html: `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`
        },
        {
          html: annotations?.runbook_url
            ? `<a href="${annotations.runbook_url}" target="_blank" rel="noopener noreferrer">Runbook</a>`
            : '- - -'
        }
      ]
    )
}
