import { format, parseISO } from 'date-fns'

/**
 * Open search requires seconds and date-fns doesn't support seconds
 * @param {string} value
 * @returns {string}
 */
function formatDatesForOpenSearch(value) {
  const date = parseISO(value)

  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'").replace(/Z$/, '.000')
}

/**
 * @typedef {object} Options
 * @property {string} testSuite
 * @property {string} environment
 * @property {string} created
 * @property {string} taskLastUpdated
 */

/**
 * Build OpenSearch logs link
 * @param {Options} options
 * @param {boolean} hasResult
 * @returns {string}
 */
function buildLogsLink(
  { testSuite, environment, created, taskLastUpdated },
  hasResult
) {
  const fromIso = formatDatesForOpenSearch(created)
  const toIso = hasResult ? formatDatesForOpenSearch(taskLastUpdated) : 'now'
  return `https://logs.${environment}.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/${testSuite}?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${fromIso}',to:'${toIso}'))`
}

export { buildLogsLink }
