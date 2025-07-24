import qs from 'qs'

import { config } from '../../../../config/config.js'
import { fetchJson } from '../../../common/helpers/fetch/fetch-json.js'
import { pagination } from '../../../common/constants/pagination.js'

async function fetchTestRuns(testSuiteName, queryParams) {
  const queryString = qs.stringify(queryParams)
  const endpoint =
    config.get('portalBackendUrl') +
    `/test-run?name=${testSuiteName}${queryString ? `&${queryString}` : ''}`

  const { payload } = await fetchJson(endpoint)

  const testRuns = payload?.data ?? []
  const page = payload?.page ?? pagination.page
  const pageSize = payload?.pageSize ?? pagination.size
  const totalPages = payload?.totalPages

  return { testRuns, page, pageSize, totalPages }
}

export { fetchTestRuns }
