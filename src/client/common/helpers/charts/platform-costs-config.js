// TODO a tonne of abstraction in here to be done
import { dollarFormatter } from '~/src/server/common/helpers/currency/formatter.js'
import {
  chartColours,
  font
} from '~/src/server/common/components/chart/helpers/utils.js'

function platformCostsConfig(data) {
  return {
    type: 'bar',
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
          stacked: true,
          display: true,
          ticks: {
            precision: 0,
            autoSkip: true,
            maxRotation: 0,
            font: font({ size: 16 })
          }
        },
        y: {
          stacked: true,
          display: true,
          beginAtZero: false,
          ticks: {
            precision: 0,
            autoSkip: false,
            maxRotation: 0,
            callback: dollarFormatter,
            font: font({ size: 14 })
          }
        }
      },
      plugins: {
        title: {
          font: font({ weight: 505, size: 19.8 }), // As close a match to the CSS weight of 700, in Chart.js canvas
          color: chartColours.get('black'),
          align: 'start',
          fullSize: true,
          display: true,
          padding: { bottom: 40 },
          text: 'Resource Costs by Environment'
        },
        legend: {
          position: 'bottom',
          labels: {
            font: font({ size: 14 }),
            boxHeight: 20,
            boxWidth: 20
          }
        },
        tooltip: {
          backgroundColor: chartColours.get('black'),
          padding: 12,
          callbacks: {
            label: (context) =>
              ` ${context.dataset.label}: ${dollarFormatter(context.parsed.y)}`,
            // TODO is this needed?
            labelColor: (context) => ({
              borderColor: context.dataset.backgroundColor,
              backgroundColor: context.dataset.backgroundColor,
              borderWidth: 0,
              borderRadius: 2
            }),
            // TODO guard better
            footer: (items) => {
              const parsed = items.at(0)?.parsed?._stacks?.y
              const total = parsed['0'] + parsed['1']

              return '\nTotal: ' + dollarFormatter(total)
            }
          }
        }
      }
    }
  }
}

export { platformCostsConfig }
