import { repositoryDetailController } from './controllers/detail.js'
import { repositoryDetailFormController } from './controllers/detail-form.js'
import { repositorySummaryController } from './controllers/summary.js'
import { repositoryCreateController } from './controllers/create.js'

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
  }
]

export { createRepositoryRoutes }
