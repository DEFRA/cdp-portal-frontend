import { chartColours } from '~/src/server/common/components/chart/helpers/utils.js'
import { commonDatasetOptions } from '~/src/server/common/components/chart/helpers/common-dataset-options.js'

function amazonWebServicesData(costs) {
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

  const devEnvironment = costs.environments.find(({ name }) => name === 'dev')

  const awsGroups = Object.groupBy(
    devEnvironment.amazonWebServices,
    ({ serviceName }) => serviceName
  )

  const datasets = Object.entries(awsGroups).map(([serviceName, detail]) =>
    buildAwsDataset(detail, serviceName)
  )

  const labels = devEnvironment.amazonWebServices.map(
    ({ date_from }) => date_from
  )

  function buildAwsDataset(detail, serviceName) {
    const data = detail.map(({ date_from, cost }) => {
      return {
        x: date_from,
        y: cost
      }
    })

    // TODO align the colours with an AWS service
    const colour = colours.shift()

    return {
      ...commonDatasetOptions,
      label: serviceName,
      backgroundColor: colour,
      borderColor: colour,
      pointBorderColor: colour,
      pointHoverBackgroundColor: colour,
      data
    }
  }

  return { labels, datasets }
}

export { amazonWebServicesData }
