import { microserviceDetailFormController } from '#server/create/microservice/controllers/detail-form.js'
import { microserviceDetailController } from '#server/create/microservice/controllers/detail.js'
import { microserviceSummaryController } from '#server/create/microservice/controllers/summary.js'
import { microserviceCreateController } from '#server/create/microservice/controllers/create.js'
import { testSuiteDetailFormController } from '../journey-test-suite/controllers/detail-form.js'
import { testSuiteDetailController } from '../journey-test-suite/controllers/detail.js'
import { testSuiteSummaryController } from '../journey-test-suite/controllers/summary.js'
import { testSuiteCreateController } from '../journey-test-suite/controllers/create.js'
import { perfTestSuiteDetailFormController } from '../perf-test-suite/controllers/detail-form.js'
import { perfTestSuiteDetailController } from '../perf-test-suite/controllers/detail.js'
import { perfTestSuiteSummaryController } from '../perf-test-suite/controllers/summary.js'
import { perfTestSuiteCreateController } from '../perf-test-suite/controllers/create.js'
import { prototypeDetailFormController } from '../prototype/controllers/detail-form.js'
import { prototypeDetailController } from '../prototype/controllers/detail.js'
import { prototypeSummaryController } from '../prototype/controllers/summary.js'
import { prototypeCreateController } from '../prototype/controllers/create.js'
import { repositoryDetailFormController } from '../repository/controllers/detail-form.js'
import { repositoryDetailController } from '../repository/controllers/detail.js'
import { repositorySummaryController } from '../repository/controllers/summary.js'
import { repositoryCreateController } from '../repository/controllers/create.js'

export const controllersMap = {
  microservice: {
    detailForm: microserviceDetailFormController,
    detail: microserviceDetailController,
    summary: microserviceSummaryController,
    create: microserviceCreateController
  },
  'journey-test-suite': {
    detailForm: testSuiteDetailFormController,
    detail: testSuiteDetailController,
    summary: testSuiteSummaryController,
    create: testSuiteCreateController
  },
  'perf-test-suite': {
    detailForm: perfTestSuiteDetailFormController,
    detail: perfTestSuiteDetailController,
    summary: perfTestSuiteSummaryController,
    create: perfTestSuiteCreateController
  },
  prototype: {
    detailForm: prototypeDetailFormController,
    detail: prototypeDetailController,
    summary: prototypeSummaryController,
    create: prototypeCreateController
  },
  repository: {
    detailForm: repositoryDetailFormController,
    detail: repositoryDetailController,
    summary: repositorySummaryController,
    create: repositoryCreateController
  }
}
