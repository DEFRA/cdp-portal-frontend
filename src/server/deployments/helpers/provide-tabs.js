import { pagination } from '~/src/server/common/constants/pagination.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import upperFirst from 'lodash/upperFirst.js'

const paginationParams = `?page=${pagination.page}&size=${pagination.size}`

async function provideTabs(request, h) {
  const authedUser = await request.getUserSession()
  const response = request.response

  if (response.variety === 'view') {
    if (!response.source?.context) {
      response.source.context = {}
    }

    response.source.context.tabDetails = {
      label: 'Deployment tabs'
    }

    response.source.context.tabDetails.tabs = getEnvironments(
      authedUser?.scope
    ).map((env) => ({
      isActive: request.path.startsWith(`/deployments/${env}`),
      url: `/deployments/${env}${paginationParams}`,
      label: `${upperFirst(env)}`,
      isSlim: true
    }))
  }
  return h.continue
}

export { provideTabs }
