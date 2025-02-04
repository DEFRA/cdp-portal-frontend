import { config } from '~/src/config/config.js'
import { fetcher } from '~/src/server/common/helpers/fetch/fetcher.js'

const mockApiUrl = config.get('mockApiUrl')

// TODO all currently pointing to mockApiUrl
async function fetchCost(serviceCode) {
  const endpoint = `${mockApiUrl}/service-codes/cdp` // TODO ad serviceCodes when ready

  const { data } = await fetcher(endpoint)
  return data
}

async function fetchCosts() {
  const endpoint = `${mockApiUrl}/costs`

  const { data } = await fetcher(endpoint)
  return { data }
}

export { fetchCost, fetchCosts }
