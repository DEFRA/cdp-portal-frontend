import { format, isDate, parseISO } from 'date-fns'

function formatDate(value, formattedDateStr = "h:mm aaa 'on' EE do MMMM yyyy") {
  const date = isDate(value) ? value : parseISO(value)

  return format(date, formattedDateStr)
}

export { formatDate }
