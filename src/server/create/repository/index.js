import {
  repositoryDetailFormController,
  repositoryDetailController,
  repositorySummaryController,
  repositoryCreateController,
  repositorySuccessController
} from '~/src/server/create/repository/controllers'

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
