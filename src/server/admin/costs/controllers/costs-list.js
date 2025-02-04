import Joi from 'joi'
import Boom from '@hapi/boom'
import camelCase from 'lodash/camelCase.js'

import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { fetchCosts } from '~/src/server/admin/costs/helpers/fetchers.js'
import { platformCostsData } from '~/src/server/admin/costs/helpers/platform-costs-data.js'
import { costToEntityRow } from '~/src/server/admin/costs/transformers/cost-to-entity-row.js'
import { serviceCodesData } from '~/src/server/admin/costs/helpers/service-codes-data.js'

// TODO most of this is moving to the PBE API
const getTotal = (totals) => (value) => {
  const total = totals.find((total) => total.name === value)
  return parseFloat(total.accountTotal)
}

function getTotals(totals) {
  const getValue = getTotal(totals)

  const infraDev = getValue('infra-dev')
  const management = getValue('management')
  const dev = getValue('dev')
  const test = getValue('test')
  const extTest = getValue('ext-test')
  const perfTest = getValue('perf-test')
  const prod = getValue('prod')

  return {
    infraDev,
    management,
    dev,
    test,
    extTest,
    perfTest,
    prod,
    get platform() {
      return (
        this.infraDev +
        this.management +
        this.dev +
        this.test +
        this.extTest +
        this.perfTest +
        this.prod
      )
    }
  }
}

const costsListController = {
  options: {
    validate: {
      query: Joi.object({
        // TODO add sorting
        from: Joi.string().allow(''),
        to: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    // TODO most of this is moving to the PBE API
    const resourceEnvironments = [
      'infra-dev',
      'management',
      'dev',
      'test',
      'ext-test',
      'perf-test',
      'prod'
    ]

    const { data: costs } = await fetchCosts()

    const costEnvironments = costs.environments
    const serviceCodes = costs.serviceCodes
    const rows = serviceCodes.map(costToEntityRow)

    const totals = getTotals(costEnvironments)
    const dataPlatformCosts = platformCostsData(costEnvironments)
    const dataServiceCodes = serviceCodesData(serviceCodes)

    return h.view('admin/costs/views/costs-list', {
      pageTitle: 'Costs',
      platformCostsChartData: {
        id: 'platform-costs',
        testId: 'platform-costs',
        data: dataPlatformCosts
      },
      totals,
      serviceCodesChartData: {
        classes: 'app-chart--medium',
        id: 'service-codes',
        testId: 'service-codes',
        data: dataServiceCodes
      },
      tableData: {
        headers: [
          {
            id: 'service-code',
            text: 'Service Code',
            sorting: { text: 'Sort Alphabetically', param: 'serviceCode:sort' },
            width: '10'
          },
          {
            id: 'team',
            text: 'Team',
            sorting: { text: 'Sort Alphabetically', param: 'team:sort' },
            width: '10'
          },
          {
            id: 'all-environments',
            text: 'Total',
            sorting: { text: 'Sort by Cost', param: 'total:sort' },
            width: '10'
          },
          ...resourceEnvironments.map((env) => ({
            id: env.toLowerCase(),
            text: formatText(env),
            sorting: {
              text: 'Sort by Cost',
              param: `${camelCase(env)}:sort`
            },
            width: 70 / resourceEnvironments.length
          }))
        ],
        rows,
        noResult: 'No costs found'
      }
    })
  }
}

export { costsListController }
