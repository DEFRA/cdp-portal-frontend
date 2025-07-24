import { format, isDate, parseISO } from 'date-fns'

import { dateFormatString } from '../../constants/date.js'

function formatDate(value, formatString = dateFormatString) {
  if (!value) {
    return
  }

  const date = isDate(value) ? value : parseISO(value)

  return format(date, formatString)
}

export { formatDate }
