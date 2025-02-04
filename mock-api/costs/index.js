import * as lambdaData from '../cost-data/lambda-message-data/index.js'

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

// Costs for all environments
function buildCosts(env) {
  const costReports =
    lambdaData[`${env}LastCalendarMonthCostsByServiceCode`].payload.cost_reports
  const taggedResourceTotal = costReports
    .reduce((total, costReport) => total + costReport.cost, 0)
    .toFixed(2)

  return {
    name: lambdaData[`${env}LastCalendarMonthTotalCost`].payload.environment,
    accountTotal:
      lambdaData[
        `${env}LastCalendarMonthTotalCost`
      ].payload.cost_reports.cost.toFixed(2),
    taggedResourceTotal,
    get untaggedResourceTotal() {
      return (this.accountTotal - this.taggedResourceTotal).toFixed(2)
    }
  }
}

const padWithZero = (environments) =>
  envPrefixes.reduce((padded, envName) => {
    if (!environments[envName]) {
      padded[envName] = 0
    } else {
      padded[envName] = environments[envName].toFixed(2)
    }
    return padded
  }, {})

const calcTotal = (envs) => {
  const total = Object.values(envs).reduce(
    (total, value) => total + parseFloat(value),
    0
  )

  return total ? total.toFixed(2) : 0
}

// Build ServiceCode totals for all envs
function buildServiceCodeTotalCosts() {
  const serviceCodesAllEnvs = {}

  for (const env of envPrefixes) {
    const costReports =
      lambdaData[`${env}LastCalendarMonthCostsByServiceCode`].payload
        .cost_reports
    const report = Object.groupBy(costReports, ({ serviceCode }) => serviceCode)

    Object.entries(report).forEach(([serviceCode, details]) => {
      if (!serviceCodesAllEnvs[serviceCode]) {
        serviceCodesAllEnvs[serviceCode] = {}
      }

      if (!serviceCodesAllEnvs[serviceCode][env]) {
        serviceCodesAllEnvs[serviceCode][env] =
          details.reduce((total, detail) => total + detail.cost, 0) ?? 0
      }
    })
  }

  return Object.entries(serviceCodesAllEnvs)
    .reduce((acc, [serviceCode, environments]) => {
      const paddedEnvironments = padWithZero(environments)

      return [
        ...acc,
        {
          name: serviceCode,
          allEnvironmentsTotal: calcTotal(paddedEnvironments),
          environments: paddedEnvironments,
          // TODO on the API get team/s associated with serviceCode
          teams: [
            {
              github: 'cdp-platform',
              teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
              name: 'Platform'
            }
          ]
        }
      ]
    }, [])
    .toSorted((a, b) => a.name.localeCompare(b.name))
}

const costs = {
  from: prodLastCalendarMonthTotalCost.payload.cost_reports.date_from,
  to: prodLastCalendarMonthTotalCost.payload.cost_reports.date_to,
  environments: envPrefixes.map((env) => buildCosts(env)),
  serviceCodes: buildServiceCodeTotalCosts()
}

export { costs }
