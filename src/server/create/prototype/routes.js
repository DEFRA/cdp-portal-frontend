import { prototypeDetailController } from './controllers/detail.js'
import { prototypeDetailFormController } from './controllers/detail-form.js'
import { prototypeSummaryController } from './controllers/summary.js'
import { prototypeCreateController } from './controllers/create.js'

const createPrototypeRoutes = [
  {
    method: 'GET',
    path: '/create/prototype/detail',
    ...prototypeDetailFormController
  },
  {
    method: 'POST',
    path: '/create/prototype/detail',
    ...prototypeDetailController
  },
  {
    method: 'GET',
    path: '/create/prototype/summary',
    ...prototypeSummaryController
  },
  {
    method: 'POST',
    path: '/create/prototype',
    ...prototypeCreateController
  }
]

export { createPrototypeRoutes }
