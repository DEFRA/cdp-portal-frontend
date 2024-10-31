import { format, isDate, parseISO } from 'date-fns'

import { dateFormatString } from '~/src/server/common/constants/date.js'

function formatDate(value, formatString = dateFormatString) {
  const date = isDate(value) ? value : parseISO(value)

  return format(date, formatString)
}

export { formatDate }
