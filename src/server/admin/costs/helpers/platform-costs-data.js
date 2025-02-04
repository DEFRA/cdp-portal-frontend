import {
  borderRadius,
  chartColours
} from '~/src/server/common/components/chart/helpers/utils.js'

function platformCostsData(costs) {
  return {
    labels: [
      'Infra-dev',
      'Management',
      'Dev',
      'Test',
      'Ext-test',
      'Perf-test',
      'Prod'
    ],
    datasets: [
      {
        label: 'Untagged',
        data: costs.map(({ untaggedResourceTotal }) => untaggedResourceTotal),
        backgroundColor: chartColours.get('light-blue'),
        borderRadius: borderRadius('bottom')
      },
      {
        label: 'Tagged',
        data: costs.map(({ taggedResourceTotal }) => taggedResourceTotal),
        backgroundColor: chartColours.get('orange'),
        borderRadius: borderRadius('top')
      }
    ]
  }
}

export { platformCostsData }
