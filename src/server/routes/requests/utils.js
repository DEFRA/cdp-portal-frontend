import { formatText } from '#config/nunjucks/filters/filters.js'

export function formatStatus(status) {
  if (status === 'closed') return 'Cancelled'
  if (status === 'merged') return 'Provisioning'

  return formatText(status)
}

export function statusTagColour(status) {
  if (status === 'closed') return 'govuk-tag--grey'
  if (status === 'failed') return 'govuk-tag--red'
  if (status === 'merged') return 'govuk-tag--green'

  return ''
}
