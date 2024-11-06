import { pagination } from '~/src/server/common/constants/pagination.js'

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
    response.source.context.tabDetails.tabs = [
      {
        isActive: request.path.startsWith('/deployments/dev'),
        url: `/deployments/dev${paginationParams}`,
        label: 'Dev'
      },
      {
        isActive: request.path.startsWith('/deployments/test'),
        url: `/deployments/test${paginationParams}`,
        label: 'Test'
      },
      {
        isActive: request.path.startsWith('/deployments/perf-test'),
        url: `/deployments/perf-test${paginationParams}`,
        label: 'Perf-test'
      },
      {
        isActive: request.path.startsWith('/deployments/prod'),
        url: `/deployments/prod${paginationParams}`,
        label: 'Prod'
      }
    ]

    if (authedUser?.isAdmin) {
      response.source.context.tabDetails.tabs.unshift(
        {
          isActive: request.path.startsWith('/deployments/infra-dev'),
          url: `/deployments/infra-dev${paginationParams}`,
          label: 'Infra-dev'
        },
        {
          isActive: request.path.startsWith('/deployments/management'),
          url: `/deployments/management${paginationParams}`,
          label: 'Management'
        },
        {
          isActive: request.path.startsWith('/deployments/ext-test'),
          url: `/deployments/ext-test${paginationParams}`,
          label: 'Ext-test'
        }
      )
    }
  }

  return h.continue
}

export { provideTabs }
