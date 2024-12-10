import { repositoryDetailController } from '~/src/server/create/repository/controllers/detail.js'
import { repositoryDetailFormController } from '~/src/server/create/repository/controllers/detail-form.js'
import { repositorySummaryController } from '~/src/server/create/repository/controllers/summary.js'
import { repositoryCreateController } from '~/src/server/create/repository/controllers/create.js'
import { repositorySuccessController } from '~/src/server/create/repository/controllers/success.js'

const createRepositoryRoutes = [
  {
    method: 'GET',
    path: '/create/repository/detail',
    ...repositoryDetailFormController
  },
  {
    method: 'POST',
    path: '/create/repository/detail',
    ...repositoryDetailController
  },
  {
    method: 'GET',
    path: '/create/repository/summary',
    ...repositorySummaryController
  },
  {
    method: 'POST',
    path: '/create/repository',
    ...repositoryCreateController
  },
  {
    method: 'GET',
    path: '/create/repository/success',
    ...repositorySuccessController
  }
]

export { createRepositoryRoutes }
