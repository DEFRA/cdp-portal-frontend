import {
  differenceInCalendarDays,
  differenceInHours,
  differenceInMinutes,
  format,
  isDate,
  isToday,
  parseISO
} from 'date-fns'
import { enGB } from 'date-fns/locale/en-GB'

function relativeDate(date, withSeconds = false) {
  const comparisonDate = isDate(date) ? date : parseISO(date)
  const now = new Date()
  const weekStartsOn = 1 //  Monday
  const hours = withSeconds ? 'pp' : 'p'

  const formatRelativeLocale = {
    secondsOk: `'In the last minute at' ${hours}`,
    justNow: `'Just now at' ${hours}`,
    minutes: `'A few minutes ago at' ${hours}`,
    tensOfMinutes: `'A little while ago at' ${hours}`,
    withinTheHour: `'Within the hour at' ${hours}`,
    anHour: `'About an hour ago at' ${hours}`,
    aFewHours: `'A few hours ago at' ${hours}`,
    earlierToday: `'Earlier today at' ${hours}`,
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

  let token

  const withinAnHour = differenceInHours(comparisonDate, now) === 0

  if (isToday(comparisonDate)) {
    if (withinAnHour) {
      const minutesDiff = differenceInMinutes(comparisonDate, now)

      if (isNaN(minutesDiff)) {
        throw new RangeError('Invalid time value')
      }

      if (minutesDiff > -1) {
        token = 'secondsOk'
      } else if (minutesDiff >= -5) {
        token = 'justNow'
      } else if (minutesDiff >= -20) {
        token = 'minutes'
      } else if (minutesDiff >= -30) {
        token = 'tensOfMinutes'
      } else if (minutesDiff >= -60) {
        token = 'withinTheHour'
      }
    } else {
      // Not within the same hour
      const hoursDiff = differenceInHours(comparisonDate, now)

      if (isNaN(hoursDiff)) {
        throw new RangeError('Invalid time value')
      }

      if (hoursDiff >= -1) {
        token = 'anHour'
      } else if (hoursDiff >= -5) {
        token = 'aFewHours'
      } else if (hoursDiff >= -10) {
        token = 'earlierToday'
      } else if (hoursDiff >= -24) {
        token = 'today'
      }
    }
  } else {
    // Not today
    const daysDiff = differenceInCalendarDays(comparisonDate, now)

    if (isNaN(daysDiff)) {
      throw new RangeError('Invalid time value')
    }

    if (daysDiff < -6) {
      token = 'other'
    } else if (daysDiff < -1) {
      token = 'lastWeek'
    } else if (daysDiff < 0) {
      token = 'yesterday'
    } else if (daysDiff < 1) {
      token = 'today'
    } else if (daysDiff < 2) {
      token = 'tomorrow'
    } else if (daysDiff < 7) {
      token = 'nextWeek'
    } else {
      token = 'other'
    }
  }

  const formatStr = locale.formatRelative(token, comparisonDate, now, {
    locale,
    weekStartsOn
  })
  return format(comparisonDate, formatStr, { locale, weekStartsOn })
}

export { relativeDate }
