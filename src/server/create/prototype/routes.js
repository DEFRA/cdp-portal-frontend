import { prototypeDetailController } from '~/src/server/create/prototype/controllers/detail.js'
import { prototypeDetailFormController } from '~/src/server/create/prototype/controllers/detail-form.js'
import { prototypeSummaryController } from '~/src/server/create/prototype/controllers/summary.js'
import { prototypeCreateController } from '~/src/server/create/prototype/controllers/create.js'

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
