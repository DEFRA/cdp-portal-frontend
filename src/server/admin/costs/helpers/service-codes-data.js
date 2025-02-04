import { chartColours } from '~/src/server/common/components/chart/helpers/utils.js'

function serviceCodesData(dataServiceCodes) {
  const colours = [
    chartColours.get('red'),
    chartColours.get('green'),
    chartColours.get('bright-purple'),
    chartColours.get('light-pink'),
    chartColours.get('yellow'),
    chartColours.get('light-blue'),
    chartColours.get('pink'),
    chartColours.get('purple'),
    chartColours.get('blue'),
    chartColours.get('dark-blue'),
    chartColours.get('turquoise'),
    chartColours.get('brown'),
    chartColours.get('orange'),
    chartColours.get('light-purple'),
    chartColours.get('light-green')
  ]

  return {
    labels: dataServiceCodes.map(({ name }) => name),
    datasets: [
      {
        label: 'Tagged',
        data: dataServiceCodes.map(
          ({ allEnvironmentsTotal }) => allEnvironmentsTotal
        ),
        backgroundColor: [...colours, ...colours], // Supports up to 30 service codes
        hoverOffset: 4
      }
    ]
  }
}

export { serviceCodesData }
