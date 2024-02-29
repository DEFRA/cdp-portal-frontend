import { format, parseISO } from 'date-fns'

/**
 * Open search requires seconds and dat-fns doesn't support seconds
 * @param value
 * @returns {string}
 */
function formatDatesForOpenSearch(value) {
  const date = parseISO(value)

  return format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'").replace(/Z$/, '.000Z')
}

/**
 * Open search requires only the second part of the arn to be escaped
 * @param arn
 * @returns {string}
 */
const encodeArn = (arn) => {
  const parts = arn.split('/')
  const firstPart = parts.shift()

  return firstPart + encodeURIComponent('/' + parts.join('/'))
}

/**
 * Open search has some special requirements
 * @param environment
 * @param taskArn
 * @param created
 * @param taskLastUpdated
 * @param hasResult
 * @returns {string}
 */
function buildLogsLink(
  { environment, taskArn, created, taskLastUpdated },
  hasResult
) {
  const arn = encodeArn(taskArn)
  const fromIso = formatDatesForOpenSearch(created)
  const to = hasResult ? formatDatesForOpenSearch(taskLastUpdated) : 'now'

  return `https://logs.${environment}.cdp-int.defra.cloud/_dashboards/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:0),time:(from:'${fromIso}',to:'${to}'))&amp;_a=(columns:!(_source),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:'ecs_task_arn:${arn}'),sort:!())&_a=(columns:!(log),filters:!(),index:c0abdf20-d49c-11ee-9eac-1d3409bea15a,interval:auto,query:(language:kuery,query:''),sort:!())`
}

export { buildLogsLink }
