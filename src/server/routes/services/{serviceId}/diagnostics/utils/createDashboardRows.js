import { formatText } from '#config/nunjucks/filters/filters.js'

export default function createDashboardRows(metrics, showPromote) {
  const dashboards = Object.entries(metrics)
    .flatMap(([_, dashboard]) => dashboard)
    .map((dashboard) => ({
      ...dashboard,
      name: dashboard.title ?? dashboard.url.split('/').at(-1)
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en-GB'))

  return dashboards.map(({ name, type = 'custom', version, url, uid }) => [
    { text: formatText(type) },
    {
      html: `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`
    },
    { text: version },
    ...(showPromote
      ? [{ html: `<a href="./dev/dashboards/promote/${uid}">Promote</a>` }]
      : [])
  ])
}
