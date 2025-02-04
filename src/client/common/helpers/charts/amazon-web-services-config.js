import { format } from 'date-fns'

import { dollarFormatter } from '~/src/server/common/helpers/currency/formatter.js'
import { buildDateAxisTickLabels } from '~/src/server/common/components/chart/helpers/build-date-axis-tick-labels.js'
import {
  chartColours,
  font
} from '~/src/server/common/components/chart/helpers/utils.js'
import { pluralise } from '~/src/server/common/helpers/pluralise.js'

function amazonWebServicesConfig(data) {
  return {
    type: 'line',
    data,
    options: {
      interaction: {
        intersect: false,
        mode: 'index'
      },
      responsive: true,
      color: chartColours.get('black'),
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          ticks: {
            autoSkip: true,
            maxRotation: 0
          },
          beforeFit: (scale) => {
            scale.ticks = buildDateAxisTickLabels(scale?.ticks)
          }
        },
        y: {
          stacked: true,
          display: true,
          beginAtZero: true,
          ticks: {
            precision: 0,
            autoSkip: false,
            maxRotation: 0,
            callback: dollarFormatter,
            font: font({ size: 14 })
          }
        }
      },
      /*
      plugins: {
        title: {
          font: font({ weight: 505, size: 19.8 }), // As close a match to the CSS weight of 700, in Chart.js canvas
          color: chartColours.get('black'),
          align: 'start',
          fullSize: true,
          display: true,
          padding: { bottom: 40 },
          text: 'Daily Costs of Amazon Web Services'
        },
        legend: {
          position: 'right',
          labels: {
            font: font({ size: 14 }),
            boxHeight: 20,
            boxWidth: 20
          }
        },
        tooltip: {
          // TODO improve we an show more here
          backgroundColor: chartColours.get('black'),
          padding: 12,
          callbacks: {
            label: (context) =>
              ` ${context.dataset.label}: ${dollarFormatter(context.parsed)}`
          }
        }
      },*/

      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: font({ size: 14 }),
            boxHeight: 20,
            boxWidth: 20
          }
        },
        tooltip: {
          itemSort: (a, b) => a.datasetIndex - b.datasetIndex,
          callbacks: {
            title: (item) => {
              const rawData = item?.[0]?.raw
              const weekStarting = rawData?.x
              const weekNumber = item?.[0]?.label?.replace(/,(.*)/, '')

              return `Week ${weekNumber} of ${format(
                weekStarting,
                'yyyy'
              )}, started on ${format(weekStarting, `EEEE do 'of' MMMM`)}`
            },
            label: (item) => {
              const datasetLabel = item?.dataset?.label
              const hourCount = item?.formattedValue

              if (datasetLabel === 'SLO') {
                return ` Lead time target: Work is in Production in ${hourCount} ${pluralise(
                  'hour',
                  hourCount
                )} or less`
              }

              if (datasetLabel?.toLowerCase() !== 'average') {
                return ` For ${datasetLabel} of the commits, lead time was under or equal to ${hourCount} ${pluralise(
                  'hour',
                  hourCount
                )}`
              }

              return ` ${datasetLabel} lead time was ${hourCount} ${pluralise(
                'hour',
                hourCount
              )}`
            },
            labelColor: (context) => ({
              borderColor: context?.dataset?.borderColor,
              backgroundColor: context?.dataset?.backgroundColor,
              borderWidth: 2
            })
          }
        }
      }
    }
  }
}

export { amazonWebServicesConfig }
