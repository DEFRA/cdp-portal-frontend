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
 * Construct buildId from ARN and service name
 * @param {string} buildId
 * @param {string} serviceName
 * @returns {string}
 */
const getBuildIdFromArn = (buildId, serviceName) => {
  const parts = buildId.split(':')
  const lastPart = parts.at(-1)

  return encodeURIComponent(`${serviceName}:${lastPart}`)
}

/**
 * @typedef {object} Options
 * @property {string} environment
 * @property {string} buildId
 * @property {string} created
 * @property {string} updated
 * @property {string} service
 */

/**
 * Build OpenSearch logs link
 * @param {Options} options
 * @param {boolean} hasResult
 * @returns {string}
 */
function buildDatabaseLogsLink(
  { environment, buildId, created, updated, service },
  hasResult
) {
  const index = '4e3049b0-2697-11f0-a796-05acfef0cbab'
  const id = getBuildIdFromArn(buildId, service)
  const fromIso = formatDatesForOpenSearch(created)
  const to = hasResult ? formatDatesForOpenSearch(updated) : 'now'

  return `https://logs.${environment}.cdp-int.defra.cloud/_dashboards/app/data-explorer/discover#?_a=(discover:(columns:!(_source),isDirty:!t,sort:!()),metadata:(indexPattern:'${index}',view:discover))&_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${fromIso}',to:'${to}'))&_q=(filters:!(('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'${index}',key:build.id,negate:!f,params:(query:'${id}'),type:phrase),query:(match_phrase:(build.id:'${id}'))),('$state':(store:appState),meta:(alias:!n,disabled:!f,index:'${index}',key:service,negate:!f,params:(query:${service}),type:phrase),query:(match_phrase:(service:${service})))),query:(language:kuery,query:''))`
}

export { buildDatabaseLogsLink }
