import { formatText } from '#config/nunjucks/filters/filters.js'
import { transformSecrets } from '../../../common/components/secrets-list/helpers/transform-secrets.js'
import { provideTestRunStatusClassname } from '#server/test-suites/helpers/provide-test-run-status-classname.js'
import { taskStatus } from '#server/test-suites/constants/test-run-status.js'
import { provideEntity } from '#server/common/helpers/ext/provide-entitiy.js'
import { provideTestRun } from '#server/test-suites/helpers/pre/provide-test-run.js'
import { fetchSecrets } from '#server/common/helpers/fetch/fetch-secrets.js'
import { testSuitefaviconState } from '#server/test-suites/test-runs/helpers/test-suite-favicon-state.js'
import { transformTestRunToStatus } from '#server/test-suites/test-runs/transformers/test-run-to-status.js'
import { transformTestRunToDetails } from '#server/test-suites/test-runs/transformers/test-run-to-details.js'
import { fetchDeploymentsWithMigrations } from '#server/deployments/helpers/fetch/fetch-deployments-with-migrations.js'
import { transformDeploymentToRunningServices } from '#server/test-suites/test-runs/transformers/deployments-to-running-services.js'

import { format } from 'date-fns'

export const testSuiteRunController = {
  options: {
    pre: [provideEntity, provideTestRun]
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testRun = request.pre.testRun

    const formattedEnvironment = formatText(testRun.environment)
    const secrets = await fetchSecrets(testRun.environment, testRun.testSuite)
    const secretDetail = transformSecrets(secrets)
    const started = format(
      new Date(testRun.created),
      "do MMM yyyy 'at' HH:mm:ss"
    )

    const deploymentsResponse = await fetchDeploymentsWithMigrations(
      testRun.environment,
      {
        teamId: entity.teams.map((t) => t.teamIds),
        from: testRun.created,
        to: testRun.taskLastUpdated
      }
    )

    const canRun =
      (await request.userIsOwner(entity)) || (await request.userIsAdmin())

    const shouldPoll =
      testRun.taskStatus !== taskStatus.failed &&
      testRun.taskStatus !== taskStatus.finished

    testRun.statusClass = provideTestRunStatusClassname(testRun.taskStatus)

    const testSuiteName = testRun.testSuite

    // why doesn't this work?
    // const notifications = testRun.failureReasons.map((f) => ({
    //   text: f.reason,
    //   type: 'error'
    // }))

    const failureReasons = testRun?.failureReasons
      .map((f) => f.reason)
      .join(', ')

    return h.view('test-suites/test-runs/views/test-suite-run', {
      faviconState: testSuitefaviconState(testRun),
      pageTitle: `${testRun?.testSuite} ${testRun?.tag} test run - ${formattedEnvironment}`,
      pageHeading: {
        caption: 'Test suite',
        text: testRun?.testSuite,
        intro: `Test suite run for <strong>${testRun?.testSuite}</strong>, version <strong>${testRun?.tag}</strong> in <strong>${testRun?.environment}</strong>`
      },
      testRun,
      shouldPoll,
      statusList: transformTestRunToStatus(
        canRun,
        testRun,
        request.plugins.crumb
      ),
      detailsList: transformTestRunToDetails(testRun, entity),
      runningServicesList:
        transformDeploymentToRunningServices(deploymentsResponse),
      secretDetail,
      // notifications,
      failureReasons,
      breadcrumbs: [
        {
          text: 'Test suites',
          href: '/test-suites'
        },
        {
          text: testSuiteName,
          href: `/test-suites/${testSuiteName}`
        },
        {
          text: started
        }
      ]
    })
  }
}
