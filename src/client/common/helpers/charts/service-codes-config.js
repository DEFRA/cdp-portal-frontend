import { dollarFormatter } from '~/src/server/common/helpers/currency/formatter.js'
import {
  chartColours,
  font
} from '~/src/server/common/components/chart/helpers/utils.js'

function serviceCodesConfig(data) {
  return {
    type: 'doughnut',
    data,
    options: {
      interaction: {
        intersect: false,
        mode: 'index'
      },
      responsive: true,
      color: chartColours.get('black'),
      plugins: {
        title: {
          font: font({ weight: 505, size: 19.8 }), // As close a match to the CSS weight of 700, in Chart.js canvas
          color: chartColours.get('black'),
          align: 'start',
          fullSize: true,
          display: true,
          padding: { bottom: 40 },
          text: 'Tagged Resource Costs by Service Code'
        },
        legend: {
          position: 'left',
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
      }
    }
  }
}

export { serviceCodesConfig }
