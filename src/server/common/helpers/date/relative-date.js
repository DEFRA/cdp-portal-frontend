import { formatRelative } from 'date-fns'
import { enGB } from 'date-fns/locale/en-GB'

function relativeDate(date, withSeconds = false) {
  const weekStartsOn = 1 //  Monday
  const hours = withSeconds ? 'pp' : 'p'

  const formatRelativeLocale = {
    lastWeek: `'Last' eeee 'at' ${hours}`,
    yesterday: `'Yesterday at' ${hours}`,
    today: `'Today at' ${hours}`,
    tomorrow: `'Tomorrow at' ${hours}`,
    nextWeek: `eeee 'at' ${hours}`,
    other: `EE do MMM yyyy 'at' ${hours}`
  }

  const locale = {
    ...enGB,
    formatRelative: (token) => formatRelativeLocale[token]
  }

  return formatRelative(date, new Date(), { locale, weekStartsOn })
}

export { relativeDate }
