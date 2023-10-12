import { format, isDate, parseISO } from 'date-fns'

function formatDate(value, formatString = 'k:mm EE do MMM yyyy') {
  const date = isDate(value) ? value : parseISO(value)

  return format(date, formatString)
}

export { formatDate }
