import Chart from 'chart.js/auto'
import 'chartjs-adapter-date-fns'
import camelCase from 'lodash/camelCase.js'

import { platformCostsConfig } from '~/src/client/common/helpers/charts/platform-costs-config.js'
import { serviceCodesConfig } from '~/src/client/common/helpers/charts/service-codes-config.js'
import { amazonWebServicesConfig } from '~/src/client/common/helpers/charts/amazon-web-services-config.js'

/**
 * @param {HTMLElement | undefined | null} $module - Chart canvas element
 */
async function chart($module) {
  if (!($module instanceof HTMLElement)) {
    return
  }

  const chartConfig = {
    platformCosts: platformCostsConfig,
    serviceCodes: serviceCodesConfig,
    amazonWebServices: amazonWebServicesConfig
  }
  const chartId = camelCase($module.id)
  const chartData = window.cdp.chartData[chartId]

  document.addEventListener('DOMContentLoaded', function () {
    new Chart($module, chartConfig[chartId](chartData))
  })
}

export { chart }
