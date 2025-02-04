/**
 * Display date axis labels. For the first tick on the axis provide day, week and year to display a tick:
 *
 *   13th  14th  15th  3rd  29th  30th  3rd
 *    Apr                   May         Jan
 *   2021                               2022
 *
 * When the previous day is higher than the current day, denoting a change of month, also display month. When the
 * year is different to the stored current year also display the year. Otherwise just display day.
 * This function is ran on the xAxis ticks in the chart.js beforeFit callback due to ticks.autoSkip sometimes not
 * showing the 1st day of a month
 *
 * @param ticks
 */
function buildDateAxisTickLabels(ticks) {
  let currentYear

  return ticks.map((tick, index, tickArray) => {
    if (Array.isArray(tick?.label)) {
      const [day, month, year] = tick?.label

      if (index === 0 && day && month && year) {
        if (String(year) !== String(currentYear)) {
          currentYear = year
        }

        return {
          ...tick,
          label: [day, month, year]
        }
      }

      const previousTick = tickArray[index - 1]
      const previousDayOfMonth = previousTick?.label?.[0]

      if (previousDayOfMonth) {
        const previousDayNumberOfMonth =
          previousTick && parseInt(previousDayOfMonth, 10)

        if (previousDayNumberOfMonth > parseInt(day, 10)) {
          const tickDateDisplay = [day, month]

          if (String(year) !== String(currentYear)) {
            currentYear = year
            tickDateDisplay.push(year)
          }

          return {
            ...tick,
            label: tickDateDisplay
          }
        }
      }

      return {
        ...tick,
        label: day
      }
    }

    return tick
  })
}

export { buildDateAxisTickLabels }
