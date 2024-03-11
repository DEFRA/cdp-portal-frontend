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

function relativeDate(date) {
  const comparisonDate = isDate(date) ? date : parseISO(date)
  const now = new Date()
  const weekStartsOn = 1 //  Monday

  const formatRelativeLocale = {
    secondsOk: "'In the last minute at' p",
    justNow: "'Just now at' p",
    minutes: "'A few minutes ago at' p",
    tensOfMinutes: "'A little while ago at' p",
    withinTheHour: "'Within the hour at' p",
    anHour: "'About an hour ago at' p",
    aFewHours: "'A few hours ago at' p",
    earlierToday: "'Earlier today at' p",
    lastWeek: "'Last' eeee 'at' p",
    yesterday: "'Yesterday at' p",
    today: "'Today at' p",
    tomorrow: "'Tomorrow at' p",
    nextWeek: "eeee 'at' p",
    other: "P 'at' p"
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
