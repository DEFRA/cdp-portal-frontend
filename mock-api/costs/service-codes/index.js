import * as lambdaData from '../../cost-data/lambda-message-data/index.js'

const prodLastCalendarMonthTotalCost = lambdaData.prodLastCalendarMonthTotalCost
const envPrefixes = [
  'infraDev',
  'management',
  'dev',
  'test',
  'extTest',
  'perfTest',
  'prod'
]

// Costs for AWS information for a specific env and service code
function buildCosts(env, serviceCode) {
  // Currently just have 1 days worth of data
  const costReports = lambdaData[
    `${env}LastCalendarMonthCostsByServiceCode`
  ].payload.cost_reports.filter(
    (report) => report.serviceCode.toLowerCase() === serviceCode
  )

  const totalCost = costReports
    .reduce((total, costReport) => total + costReport.cost, 0)
    .toFixed(2)

  return {
    name: env,
    totalCost,
    amazonWebServices: Object.values(
      Object.groupBy(costReports, ({ serviceName }) => serviceName)
    ).flat()
  }
}

// Just done for ServiceCode CDP in this mock data
const serviceCodes = [
  {
    id: 'cdp',
    from: prodLastCalendarMonthTotalCost.payload.cost_reports.date_from, // 1 Month query
    to: prodLastCalendarMonthTotalCost.payload.cost_reports.date_to, // 1 Month query
    environments: envPrefixes.map((env) => buildCosts(env, 'cdp'))
  }
]

export { serviceCodes }
